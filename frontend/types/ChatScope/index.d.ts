declare module '@chatscope/chat-ui-kit-react'{
    import * as React from 'react';

    interface Avatar extends React.ComponentClass<any> {

    }
    export const Avatar: Avatar;

    interface ChatContainer extends React.FC<any> {}
    interface MessageInput extends React.FC<any> {}
    interface MessageList extends React.FC<any> {}
    interface MessageSeparator extends React.FC<any> {}
    interface TypingIndicator extends React.FC<any> {}
    interface MainContainer extends React.FC<any> {}
    interface Footer extends React.FC<any> {}
    interface Message extends React.FC<any> {Footer:Footer}
    export const ChatContainer: ChatContainer;
    export const MessageInput: MessageInput;
    export const MessageList: MessageList;
    export const MessageSeparator: MessageSeparator;
    export const TypingIndicator: TypingIndicator;
    export const Message: Message;
    Message.Footer = Footer;
    export const MainContainer: MainContainer;

    interface ConversationHeader extends React.ComponentClass<any> {
        Back: any
        Content: any
        Actions: any
    }
    export const ConversationHeader: ConversationHeader;
}

declare module '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
