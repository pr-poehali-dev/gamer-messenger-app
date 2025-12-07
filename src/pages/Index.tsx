import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';

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

type UserData = {
  phone: string;
  name: string;
  status: string;
  isAuthenticated: boolean;
};

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [userName, setUserName] = useState('GamerPro');
  const [userStatus, setUserStatus] = useState('В игре');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      const savedUser = localStorage.getItem('rilmas_user');
      if (savedUser) {
        const userData: UserData = JSON.parse(savedUser);
        setIsAuthenticated(userData.isAuthenticated);
        setUserName(userData.name);
        setUserStatus(userData.status);
        setPhoneNumber(userData.phone);
      } else {
        setShowPhoneInput(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const userData: UserData = {
        phone: phoneNumber,
        name: userName,
        status: userStatus,
        isAuthenticated: true,
      };
      localStorage.setItem('rilmas_user', JSON.stringify(userData));
    }
  }, [isAuthenticated, phoneNumber, userName, userStatus]);

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

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 10) {
      const code = Math.floor(10000 + Math.random() * 90000).toString();
      setSentCode(code);
      setShowPhoneInput(false);
      setShowCodeInput(true);
      toast.success(`Код отправлен на номер ${phoneNumber}`, {
        description: `Ваш код: ${code}`,
      });
    } else {
      toast.error('Введите корректный номер телефона');
    }
  };

  const handleCodeSubmit = () => {
    if (verificationCode === sentCode) {
      setIsAuthenticated(true);
      setShowCodeInput(false);
      toast.success('Вы успешно вошли в Rilmas!');
    } else {
      toast.error('Неверный код. Попробуйте снова.');
      setVerificationCode('');
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

  if (showPhoneInput) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-scale-in">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎮</span>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Добро пожаловать в Rilmas</h2>
            <p className="text-muted-foreground text-center mb-8">Введите номер телефона для регистрации</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Номер телефона</Label>
                <Input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-lg"
                />
              </div>
              <Button onClick={handlePhoneSubmit} className="w-full" size="lg">
                Продолжить
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showCodeInput) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-scale-in">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
              <Icon name="ShieldCheck" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Подтверждение</h2>
            <p className="text-muted-foreground text-center mb-8">
              Введите 5-значный код, отправленный на номер <br />
              <span className="font-semibold text-foreground">{phoneNumber}</span>
            </p>
            <div className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={5} value={verificationCode} onChange={setVerificationCode}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-14 h-14 text-2xl" />
                    <InputOTPSlot index={1} className="w-14 h-14 text-2xl" />
                    <InputOTPSlot index={2} className="w-14 h-14 text-2xl" />
                    <InputOTPSlot index={3} className="w-14 h-14 text-2xl" />
                    <InputOTPSlot index={4} className="w-14 h-14 text-2xl" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button onClick={handleCodeSubmit} className="w-full" size="lg" disabled={verificationCode.length !== 5}>
                Подтвердить
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowCodeInput(false);
                  setShowPhoneInput(true);
                  setVerificationCode('');
                }}
                className="w-full"
              >
                Изменить номер
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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
                <div className="space-y-2">
                  <Label>Номер телефона</Label>
                  <Input value={phoneNumber} disabled className="bg-muted" />
                </div>
                <Button
                  variant="destructive"
                  onClick={() => {
                    localStorage.removeItem('rilmas_user');
                    setIsAuthenticated(false);
                    setShowPhoneInput(true);
                    toast.info('Вы вышли из аккаунта');
                  }}
                  className="w-full"
                >
                  Выйти из аккаунта
                </Button>
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
