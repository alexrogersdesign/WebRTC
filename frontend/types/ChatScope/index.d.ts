
declare module '@chatscope/chat-ui-kit-react'{
    import * as React from 'react';

    interface Avatar extends React.ComponentClass<any> {
    }
    export const Avatar: Avatar;

    interface ChatContainer extends React.FC<any> {}
    interface MessageInput extends React.FC<any> {}
    interface MessageContent extends React.FC<any> {}
    interface MessageList extends React.FC<any> {
        Content:MessageContent,
    }
    interface MessageSeparator extends React.FC<any> {}
    interface TypingIndicator extends React.FC<any> {}
    interface MainContainer extends React.FC<any> {}
    interface MessageFooter extends React.FC<any> {}
    interface MessageHeader extends React.FC<any> {}
    interface MessageCustomContent extends React.FC<any> {}
    interface MessageTextContent extends React.FC<any> {}
    interface Message extends React.ComponentClass<any> {
        Header:MessageHeader,
        Footer:MessageFooter,
        CustomContent:MessageCustomContent,
        TextContent: MessageTextContent,
    }
    export const ChatContainer: ChatContainer;
    export const MessageInput: MessageInput;
    export const MessageList: MessageList;
    export const MessageSeparator: MessageSeparator;
    export const TypingIndicator: TypingIndicator;
    export const Message: Message;
    Message.Footer = MessageFooter;
    Message.Header = MessageHeader;
    Message.CustomContent = MessageCustomContent;
    export const MainContainer: MainContainer;

    interface ConversationHeader extends React.ComponentClass<any> {
        Back: any
        Content: any
        Actions: any
    }
    export const ConversationHeader: ConversationHeader;
}
// declare module '@chatscope/chat-ui-kit-react/Message'{
//     import * as React from 'react';
//     interface Footer extends React.FC<any> {}
//     export const Footer: Footer;
// }


// declare module '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
