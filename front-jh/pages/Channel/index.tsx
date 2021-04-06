import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Header, DragOver } from '@pages/Channel/styles';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import makeSection from '@utils/makeSection';
import axios from 'axios';
import { useParams } from 'react-router';
import useSWR, { useSWRInfinite } from 'swr';
import fetcher from '@utils/fetcher';
import useSocket from '@hooks/useSocket';
import { Scrollbars } from 'react-custom-scrollbars';
import { IChannel, IChat, IUser } from '@typings/db';
import InviteChannelModal from '@components/InviteChannelModal';
import { toast, ToastContainer } from 'react-toastify';

const Channel = () => {
    const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
    const { data: myData } = useSWR(`/api/users`, fetcher);
    const [chat, onChangeChat, setChat] = useInput('');
    const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
    const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IChat[]>(
        (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
        fetcher,
        {
            onSuccess(data) {
                if (data?.length === 1) {
                    setTimeout(() => {
                        scrollbarRef.current?.scrollToBottom();
                    }, 100);
                }
            },
        },
    );
    const { data: channelMembersData } = useSWR<IUser[]>(
        myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
        fetcher,
    );
    const [socket] = useSocket(workspace);
    const isEmpty = chatData?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
    const scrollbarRef = useRef<Scrollbars>(null);
    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const onSubmitForm = useCallback(
        (e) => {
            e.preventDefault();
            if (chat?.trim() && chatData && channelData && myData) {
                const savedChat = chat;
                mutateChat((prevChatData) => {
                    prevChatData?.[0].unshift({
                        id: (chatData[0][0]?.id || 0) + 1,
                        content: savedChat,
                        UserId: myData.id,
                        User: myData,
                        ChannelId: channelData.id,
                        Channel: channelData,
                        createdAt: new Date(),
                    });
                    return prevChatData;
                }, false).then(() => {
                    localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
                    setChat('');
                    scrollbarRef.current?.scrollToBottom();
                });
                axios
                    .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
                        content: savedChat,
                    })
                    .then(() => {
                        revalidate();
                    })
                    .catch(console.error);
            }
        },
        [chat, chatData, myData, channelData, workspace, channel],
    );

    const onMessage = useCallback(
        (data: IChat) => {
            // id = 상대방 id
            if ((data.Channel.name === channel && data.content.startsWith('uploads\\')) || data.UserId !== myData?.id) {
                mutateChat((chatData) => {
                    chatData?.[0].unshift(data);
                    return chatData;
                }, false).then(() => {
                    if (scrollbarRef.current) {
                        if (
                            scrollbarRef.current.getScrollHeight() <
                            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
                        ) {
                            console.log('scrollToBottom', scrollbarRef.current?.getValues());
                            setTimeout(() => {
                                scrollbarRef.current?.scrollToBottom();
                            }, 100);
                        } else {
                            toast.success('새 메시지가 도착했습니다.', {
                                onClick() {
                                    scrollbarRef.current?.scrollToBottom();
                                },
                                closeOnClick: true,
                            });
                        }
                    }
                });
            }
        },
        [channel, myData, mutateChat],
    );

    useEffect(() => {
        socket?.on('message', onMessage);
        return () => {
            socket?.off('message', onMessage);
        };
    }, [socket, onMessage]);

    //로딩 시 스크롤바 아래에 위치
    useEffect(() => {
        localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
    }, [workspace, channel]);

    const onDrop = useCallback(
        (e) => {
            e.preventDefault();
            const formData = new FormData();
            if (e.dataTransfer.items) {
                // Use DataTransferItemList interface to access the file(s)
                for (let i = 0; i < e.dataTransfer.items.length; i++) {
                    // If dropped items aren't files, reject them
                    if (e.dataTransfer.items[i].kind === 'file') {
                        const file = e.dataTransfer.items[i].getAsFile();
                        console.log('... file[' + i + '].name = ' + file.name);
                        formData.append('image', file);
                    }
                }
            } else {
                // Use DataTransfer interface to access the file(s)
                for (let i = 0; i < e.dataTransfer.files.length; i++) {
                    console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
                    formData.append('image', e.dataTransfer.files[i]);
                }
            }
            axios.post(`/api/workspaces/${workspace}/channels/${channel}/images`, formData).then(() => {
                setDragOver(false);
                localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
            });
        },
        [workspace, channel],
    );

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const onClickInviteChannel = useCallback(() => {
        setShowInviteChannelModal(true);
    }, []);
    const onCloseModal = useCallback(() => {
        setShowInviteChannelModal(false);
    }, []);

    if (!myData || !myData) {
        return null;
    }

    const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);
    return (
        <Container onDrop={onDrop} onDragOver={onDragOver}>
            <Header>
                <span>#{channel}</span>
                <div className="header-right">
                    <span>{channelMembersData?.length}</span>
                    <button
                        onClick={onClickInviteChannel}
                        className="c-button-unstyled p-ia__view_header__button"
                        aria-label="Add people to #react-native"
                        data-sk="tooltip_parent"
                        type="button"
                    >
                        <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
                    </button>
                </div>
            </Header>
            <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
            <ChatBox
                chat={chat}
                onChangeChat={onChangeChat}
                onSubmitForm={onSubmitForm}
                placeholder={`Message #${channel}`}
            />
            <InviteChannelModal
                show={showInviteChannelModal}
                onCloseModal={onCloseModal}
                setShowInviteChannelModal={setShowInviteChannelModal}
            />
            <ToastContainer position="bottom-center" />
            {dragOver && <DragOver>업로드</DragOver>}
        </Container>
    );
};

export default Channel;
