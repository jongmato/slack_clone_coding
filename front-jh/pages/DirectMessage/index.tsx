import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DragOver } from '@pages/Channel/styles';
import { Container, Header } from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import useSWR, { useSWRInfinite } from 'swr';
import { useParams } from 'react-router';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from '@typings/db';
import makeSection from '@utils/makeSection';
import { Scrollbars } from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';
import { toast } from 'react-toastify';

const DirectMessage = () => {
    const { workspace, id } = useParams<{ workspace: string; id: string }>();
    const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
    const { data: myData } = useSWR(`/api/users`, fetcher);
    const [chat, onChangeChat, setChat] = useInput('');
    const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IDM[]>(
        (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
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
    const [socket] = useSocket(workspace);
    const isEmpty = chatData?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;
    const scrollbarRef = useRef<Scrollbars>(null);
    const [dragOver, setDragOver] = useState(false);

    const onSubmitForm = useCallback(
        (e) => {
            e.preventDefault();
            if (chat?.trim() && chatData) {
                const savedChat = chat;
                mutateChat((prevChatData) => {
                    prevChatData?.[0].unshift({
                        id: (chatData[0][0]?.id || 0) + 1,
                        content: savedChat,
                        SenderId: myData.id,
                        Sender: myData,
                        ReceiverId: userData.id,
                        Receiver: userData,
                        createdAt: new Date(),
                    });
                    return prevChatData;
                }, false).then(() => {
                    localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
                    setChat('');
                    scrollbarRef.current?.scrollToBottom();
                });
                axios
                    .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
                        content: chat,
                    })
                    .then(() => {
                        revalidate();
                    })
                    .catch(console.error);
            }
        },
        [chat, chatData, myData, userData, workspace, id],
    );

    const onMessage = useCallback(
        (data: IDM) => {
            // id = 상대방 id
            if (data.SenderId === Number(id) && myData.id !== Number(id)) {
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
        [id, myData, mutateChat],
    );

    useEffect(() => {
        socket?.on('dm', onMessage);
        return () => {
            socket?.off('dm', onMessage);
        };
    }, [socket, onMessage]);

    //로딩 시 스크롤바 아래에 위치
    useEffect(() => {
        localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
    }, [workspace, id]);

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
            axios.post(`/api/workspaces/${workspace}/dms/${id}/images`, formData).then(() => {
                setDragOver(false);
                localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
                revalidate();
            });
        },
        [workspace, id, revalidate],
    );

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    if (!userData || !myData) {
        return null;
    }

    const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

    return (
        <Container onDrop={onDrop} onDragOver={onDragOver}>
            <Header>
                <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
                <span>{userData.nickname}</span>
            </Header>
            <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
            <ChatBox
                chat={chat}
                onChangeChat={onChangeChat}
                onSubmitForm={onSubmitForm}
                placeholder={`Message ${userData.nickname}`}
            />
            {dragOver && <DragOver>업로드</DragOver>}
        </Container>
    );
};

export default DirectMessage;
