import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import React, { forwardRef, MutableRefObject, RefObject, useCallback } from 'react';
import { IChat, IDM } from '@typings/db';
import {Scrollbars} from 'react-custom-scrollbars';
import Chat from '@components/Chat';


interface Props {
    chatSections: { [key: string]: (IDM | IChat)[] };
    setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
    isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isReachingEnd }, scrollbarRef) => {
    const onScroll = useCallback(
        (values) => {
            if (values.scrollTop === 0 && !isReachingEnd) {
                console.log('가장 위');
                setSize((prevSize) => prevSize + 1).then(() => {
                    // 스크롤 위치 유지
                    const current = (scrollbarRef as MutableRefObject<Scrollbars>)?.current;
                    if (current) {
                        current.scrollTop(current.getScrollHeight() - values.scrollHeight);
                    }
                });
            }
        },
        [scrollbarRef, isReachingEnd, setSize],
    );

    return (
        <ChatZone>
            <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
                {Object.entries(chatSections).map(([date, chats]) => {
                    return (
                        <Section className={`section-${date}`} key={date}>
                            <StickyHeader>
                                <button>{date}</button>
                            </StickyHeader>
                            {chats.map((chat) => (
                                <Chat key={chat.id} data={chat} />
                            ))}
                        </Section>
                    );
                })}
            </Scrollbars>
        </ChatZone>
    );
});

export default ChatList;
