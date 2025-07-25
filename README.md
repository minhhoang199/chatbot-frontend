# Angular Chat Application

A modern chat application built with Angular, featuring a component-based architecture that closely resembles popular messaging platforms like Facebook Messenger.

## Component Structure

### 1. ChatWindowComponent (`chat-window`)
- **Purpose**: Main container component that orchestrates the entire chat interface
- **Location**: `src/app/components/chat-window/`
- **Responsibilities**:
  - Manages the selected room state
  - Handles communication between room list and chat room components
  - Displays placeholder content when no room is selected

### 2. RoomListComponent (`room-list`)
- **Purpose**: Sidebar component displaying the list of conversations
- **Location**: `src/app/components/room-list/`
- **Features**:
  - User profile header with action buttons
  - Search functionality for conversations
  - Archived conversations section
  - List of active conversations with:
    - Profile pictures
    - Names and timestamps
    - Last message previews
    - Unread message counts
    - Read status indicators
- **Events**: Emits `roomSelected` when a conversation is clicked

### 3. ChatRoomComponent (`chat-room`)
- **Purpose**: Main chat area displaying messages for the selected room
- **Location**: `src/app/components/chat-room/`
- **Features**:
  - Chat header with contact info and action buttons
  - Messages container with scroll functionality
  - Message input area with send functionality
  - Real-time message sending (Enter key support)
- **Inputs**: 
  - `selectedRoom`: The currently active room object

### 4. MessageComponent (`message`)
- **Purpose**: Individual message display component
- **Location**: `src/app/components/message/`
- **Features**:
  - Sent/received message styling
  - Timestamp display
  - Read receipt indicators
  - Message bubble design
- **Inputs**:
  - `message`: Message object to display
  - `isFromCurrentUser`: Boolean to determine message alignment and styling

## Data Models

### Room Model
```typescript
interface Room {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: Message;
  lastSeen: string;
  unreadCount: number;
  isOnline: boolean;
  participants: string[];
}
```

### Message Model
```typescript
interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'file' | 'emoji';
  attachmentUrl?: string;
}
```

## Service Layer

### ChatService
- **Purpose**: Manages chat data and operations
- **Location**: `src/app/services/chat.service.ts`
- **Methods**:
  - `getRooms()`: Returns sorted list of rooms
  - `getMessagesForRoom(roomId)`: Returns messages for specific room
  - `sendMessage(roomId, message)`: Adds new message to room
  - `markMessagesAsRead(roomId)`: Marks messages as read

## Features

### ✅ Implemented
- **Responsive Design**: Adapts to different screen sizes
- **Real-time UI Updates**: Messages appear instantly
- **Search Functionality**: Filter conversations by name or content
- **Message Status**: Read receipts and timestamps
- **Unread Counters**: Badge showing unread message count
- **Smooth Animations**: Message slide-in effects
- **Keyboard Support**: Enter to send messages
- **Modern UI**: Facebook Messenger-inspired design

### 🚀 Future Enhancements
- **Real-time Communication**: WebSocket integration
- **File Attachments**: Image and file sharing
- **Emoji Support**: Emoji picker and reactions
- **Voice Messages**: Audio message recording
- **Message Reactions**: Like, love, laugh reactions
- **Typing Indicators**: Show when someone is typing
- **Online Status**: Real-time user presence
- **Message Search**: Search within conversations
- **Message Deletion**: Delete/edit sent messages
- **Group Chats**: Multi-participant conversations

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Development Server**
   ```bash
   ng serve
   ```

3. **Build for Production**
   ```bash
   ng build --prod
   ```

## Architecture Benefits

### Component Separation
- **Maintainable**: Each component has a single responsibility
- **Reusable**: Components can be easily reused in different contexts
- **Testable**: Isolated components are easier to unit test
- **Scalable**: New features can be added without affecting existing components

### Data Flow
- **Unidirectional**: Data flows down through inputs, events flow up through outputs
- **Predictable**: State changes are centralized in the service layer
- **Debuggable**: Easy to trace data flow and state changes

### Styling Strategy
- **Component-scoped**: Each component has its own CSS file
- **Consistent**: Shared design tokens and color scheme
- **Responsive**: Mobile-first design approach
- **Modern**: Uses CSS Flexbox and Grid for layouts

## File Structure

```
src/app/
├── components/
│   ├── chat-window/
│   │   ├── chat-window.component.ts
│   │   ├── chat-window.component.html
│   │   └── chat-window.component.css
│   ├── room-list/
│   │   ├── room-list.component.ts
│   │   ├── room-list.component.html
│   │   └── room-list.component.css
│   ├── chat-room/
│   │   ├── chat-room.component.ts
│   │   ├── chat-room.component.html
│   │   └── chat-room.component.css
│   └── message/
│       ├── message.component.ts
│       ├── message.component.html
│       └── message.component.css
├── models/
│   ├── room.model.ts
│   └── message.model.ts
├── services/
│   └── chat.service.ts
├── app.component.ts
├── app.component.html
├── app.component.css
└── app.module.ts
```

This architecture provides a solid foundation for building a scalable, maintainable chat application with Angular.