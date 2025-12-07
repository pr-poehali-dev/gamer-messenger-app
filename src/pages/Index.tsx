import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

type Message = {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
};

type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
};

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [userName, setUserName] = useState('GamerPro');
  const [userStatus, setUserStatus] = useState('В игре');

  const [chats] = useState<Chat[]>([
    { id: 1, name: 'Артем', avatar: '🎮', lastMessage: 'Го в Dota?', time: '12:30', unread: 2 },
    { id: 2, name: 'Команда Valorant', avatar: '🔥', lastMessage: 'Саша: Собираемся в 20:00', time: '11:45', unread: 5 },
    { id: 3, name: 'Макс', avatar: '👾', lastMessage: 'Спасибо за помощь!', time: 'Вчера' },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет! Как дела?', sender: 'other', time: '12:28' },
    { id: 2, text: 'Нормально, го играть?', sender: 'me', time: '12:29' },
    { id: 3, text: 'Го в Dota?', sender: 'other', time: '12:30' },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageText,
        sender: 'me',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center overflow-hidden">
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl bg-primary flex items-center justify-center animate-logo-appear">
            <span className="text-6xl">🎮</span>
          </div>
          <div className="absolute -top-2 -right-2 w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center opacity-0 animate-letter-slide">
            <span className="text-4xl font-bold text-white">R</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-background flex overflow-hidden">
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-border animate-fade-in`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Rilmas</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icon name="Settings" size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Настройки</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Имя</Label>
                  <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Статус</Label>
                  <Input value={userStatus} onChange={(e) => setUserStatus(e.target.value)} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger value="chats" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Чаты
            </TabsTrigger>
            <TabsTrigger value="contacts" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Контакты
            </TabsTrigger>
            <TabsTrigger value="groups" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Группы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="flex-1 m-0">
            <ScrollArea className="h-full">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                    selectedChat === chat.id ? 'bg-muted' : ''
                  }`}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-2xl">{chat.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{chat.name}</span>
                      <span className="text-xs text-muted-foreground">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground truncate">{chat.lastMessage}</span>
                      {chat.unread && (
                        <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="contacts" className="flex-1 m-0">
            <div className="p-8 text-center text-muted-foreground">
              <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Добавьте друзей по ссылке-приглашению</p>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="flex-1 m-0">
            <div className="p-8 text-center text-muted-foreground">
              <Icon name="UsersRound" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Создайте свою первую группу</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-secondary text-lg">👤</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-sm">{userName}</div>
              <div className="text-xs text-muted-foreground">{userStatus}</div>
            </div>
            <Button variant="ghost" size="icon">
              <Icon name="MoreVertical" size={20} />
            </Button>
          </div>
        </div>
      </div>

      {selectedChat ? (
        <div className="flex-1 flex flex-col animate-slide-in-right">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedChat(null)}>
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-lg">
                {chats.find((c) => c.id === selectedChat)?.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold">{chats.find((c) => c.id === selectedChat)?.name}</div>
              <div className="text-xs text-muted-foreground">онлайн</div>
            </div>
            <Button variant="ghost" size="icon">
              <Icon name="Phone" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Video" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="MoreVertical" size={20} />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Icon name="Paperclip" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Smile" size={20} />
              </Button>
              <Input
                placeholder="Введите сообщение..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="icon">
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">💬</span>
            </div>
            <p className="text-lg">Выберите чат для начала общения</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
