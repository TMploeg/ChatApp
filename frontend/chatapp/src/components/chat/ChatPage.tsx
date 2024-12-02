import { useContext, useEffect, useState } from "react";
import Message from "../../models/message";
import { ClipLoader } from "react-spinners";
import Chat from "./Chat";
import { useApi, useAppNavigate, useChatGroups } from "../../hooks";
import ApiRoute from "../../enums/ApiRoute";
import { useParams } from "react-router-dom";
import AppRoute from "../../enums/AppRoute";
import { ChangeHandlerContext, SubscriptionContext } from "../../context";
import StompBroker from "../../enums/StompBroker";
import ChatGroup, { UsersDisplayData } from "../../models/chat-group";
import ChangeHandlerName from "../../enums/ChangeHandlerName";
import { Button, Dropdown, Overlay } from "react-bootstrap";
import { BsPeopleFill, BsPersonLinesFill } from "react-icons/bs";
import GroupUsersDropdown from "./group-users-dropdown/GroupUsersDropdown";

export default function ChatPage() {
  const [chatGroup, setChatGroup] = useState<ChatGroup>();
  const [messages, setMessages] = useState<Message[]>();
  const [usersDropdownVisible, setUsersDropdownVisible] =
    useState<boolean>(false);

  const { get, post } = useApi();
  const navigate = useAppNavigate();
  const { id } = useParams();

  const subscriptions = useContext(SubscriptionContext);
  const changeHandlers = useContext(ChangeHandlerContext);

  const { getById: getChatGroupById, changeName } = useChatGroups();

  if (!id) {
    navigate(AppRoute.HOME);
    return;
  }

  useEffect(() => {
    if (!id) {
      return;
    }

    const subscription = subscriptions.subscribe<Message>(
      StompBroker.CHAT(id),
      (message) => handleNewMessage(message)
    );

    loadChatGroup(id);

    setUsersDropdownVisible(false);

    return () => {
      setChatGroup(undefined);
      setMessages(undefined);
      subscription.unsubscribe();
    };
  }, [id]);

  if (messages === undefined) {
    return (
      <div>
        <ClipLoader color="#3388ff" />
      </div>
    );
  }

  return (
    <div className="chat-page">
      {chatGroup && (
        <div className="chat-page-title">
          <GroupName group={chatGroup} onNameChanged={handleNameChanged} />
          <div className="users-dropdown-container">
            <Button
              variant="secondary"
              onClick={() => setUsersDropdownVisible((visible) => !visible)}
            >
              <BsPersonLinesFill />
            </Button>
            <GroupUsersDropdown
              visible={usersDropdownVisible}
              users={chatGroup.getUsers()}
            />
          </div>
        </div>
      )}
      <Chat
        messages={messages}
        onSendMessage={(message) =>
          post(ApiRoute.CHAT(), message, { groupId: id })
        }
      />
    </div>
  );

  function handleNewMessage(message: Message) {
    setMessages((oldMessages) => {
      if (!oldMessages) {
        return undefined;
      }

      return [message, ...oldMessages];
    });
  }

  function handleNameChanged(newName: string) {
    if (!chatGroup) {
      return;
    }

    changeName(chatGroup, newName).then(setChatGroup);

    changeHandlers.onChange(ChangeHandlerName.CHAT_GROUP_NAME, {
      groupId: chatGroup.getId(),
      newName,
    });
  }

  async function loadChatGroup(id: string) {
    try {
      const group = await getChatGroupById(id);
      setChatGroup(group);

      const messages = await get<Message[]>(ApiRoute.CHAT(), { groupId: id });
      setMessages(messages);
    } catch {
      navigate(AppRoute.HOME);
    }
  }
}

interface GroupNameProps {
  group: ChatGroup;
  onNameChanged?: (newName: string) => void;
}
function GroupName({ group, onNameChanged }: GroupNameProps) {
  const [editing, setEditing] = useState<boolean>(false);

  return (
    <div
      className={`chat-name ${!group.isClosed() ? "editable" : ""} ${
        editing ? "editing" : ""
      }`}
    >
      {editing ? (
        <NameEditor
          onSubmit={(newName) => {
            setEditing(false);
            onNameChanged?.(newName);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <span className="chat-name-display" onClick={() => setEditing(true)}>
          {group.getName() ?? (
            <GroupNamePlaceholder
              usersDisplayData={group.getUsersDisplayData()}
            />
          )}
        </span>
      )}
    </div>
  );
}

interface GroupNamePlaceholderProps {
  usersDisplayData: UsersDisplayData;
}
function GroupNamePlaceholder({ usersDisplayData }: GroupNamePlaceholderProps) {
  return (
    <>
      {usersDisplayData.users
        .map((user) => <span>{user.username}</span>)
        .reduce((a, c) => (
          <>
            {a}
            {", "}
            {c}
          </>
        ))}
      {usersDisplayData.remaining > 0 && (
        <>
          {" "}
          <span style={{ color: "#FFFFFF77" }}>
            and {usersDisplayData.remaining} other users
          </span>
        </>
      )}
    </>
  );
}

interface NameEditorProps {
  onSubmit?: (newName: string) => void;
  onCancel?: () => void;
}
function NameEditor({ onSubmit, onCancel }: NameEditorProps) {
  const [name, setName] = useState<string>("");

  return (
    <input
      autoFocus
      value={name}
      onChange={(e) => setName(e.target.value)}
      onKeyUp={(e) => handleKeyUp(e.key)}
      className="chat-name-input"
    />
  );

  function handleKeyUp(key: string) {
    switch (key) {
      case "Enter":
        if (confirm(`Change group name to '${name}'`)) {
          onSubmit?.(name);
          setName("");
        }
        break;
      case "Escape":
        onCancel?.();
        break;
      default:
        break;
    }
  }
}
