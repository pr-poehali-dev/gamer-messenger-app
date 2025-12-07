import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
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
      toast.success(`SMS-код отправлен на ${phoneNumber}`, {
        description: `Код для входа: ${code}`,
        duration: 10000,
      });
    } else {
      toast.error('Введите корректный номер телефона');
    }
  };

  const handleCodeSubmit = () => {
    if (verificationCode === sentCode) {
      setIsAuthenticated(true);
      setShowCodeInput(false);
      toast.success('Добро пожаловать в Rilmas!');
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
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Rilmas</h1>
                <p className="text-sm text-muted-foreground">Геймерский мессенджер</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Вход по номеру телефона</h2>
            <p className="text-muted-foreground mb-6">Мы отправим SMS с кодом подтверждения</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Номер телефона</Label>
                <Input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-lg h-12"
                />
              </div>
              <Button onClick={handlePhoneSubmit} className="w-full h-12" size="lg">
                Получить код
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
              <Icon name="MessageSquareCode" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Введите код из SMS</h2>
            <p className="text-muted-foreground text-center mb-8">
              Код отправлен на номер<br />
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
              <Button onClick={handleCodeSubmit} className="w-full h-12" size="lg" disabled={verificationCode.length !== 5}>
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
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-xl">🎮</span>
          </div>
          <h1 className="text-xl font-bold">Rilmas</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Icon name="Bell" size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="Search" size={20} />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'chats' && !selectedChat && (
          <ScrollArea className="h-full animate-fade-in">
            {chats.length === 0 ? (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Icon name="MessageSquare" size={40} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Пока нет чатов</h3>
                  <p className="text-muted-foreground">Пригласите друзей, чтобы начать общение</p>
                </div>
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors border-b border-border"
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
                        <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 font-medium">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </ScrollArea>
        )}

        {activeTab === 'chats' && selectedChat && (
          <div className="h-full flex flex-col animate-slide-in-right">
            <div className="p-4 border-b border-border flex items-center gap-3 bg-card">
              <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)}>
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
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
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

            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Icon name="Plus" size={20} />
                </Button>
                <Input
                  placeholder="Сообщение..."
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
        )}

        {activeTab === 'groups' && (
          <div className="h-full flex items-center justify-center p-8 animate-fade-in">
            <div className="text-center">
              <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Группы</h3>
              <p className="text-muted-foreground mb-4">Создавайте группы до 200 000 участников</p>
              <Button>
                <Icon name="Plus" size={18} className="mr-2" />
                Создать группу
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="h-full flex items-center justify-center p-8 animate-fade-in">
            <div className="text-center">
              <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Icon name="UserPlus" size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Друзья</h3>
              <p className="text-muted-foreground mb-4">Приглашайте друзей по ссылке</p>
              <Button>
                <Icon name="Share2" size={18} className="mr-2" />
                Пригласить друзей
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="h-full flex items-center justify-center p-8 animate-fade-in">
            <div className="text-center">
              <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Icon name="Gamepad2" size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Игры</h3>
              <p className="text-muted-foreground">Скоро здесь появятся игры</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <ScrollArea className="h-full animate-fade-in">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-secondary text-3xl">👤</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{userName}</h2>
                  <p className="text-muted-foreground">{userStatus}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Имя пользователя</Label>
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
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти из аккаунта
              </Button>
            </div>
          </ScrollArea>
        )}
      </div>

      <nav className="bg-card border-t border-border px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => { setActiveTab('chats'); setSelectedChat(null); }}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'chats' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="MessageSquare" size={24} />
          <span className="text-xs font-medium">Чаты</span>
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'groups' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="Users" size={24} />
          <span className="text-xs font-medium">Группы</span>
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'friends' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="UserPlus" size={24} />
          <span className="text-xs font-medium">Друзья</span>
        </button>
        <button
          onClick={() => setActiveTab('games')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'games' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="Gamepad2" size={24} />
          <span className="text-xs font-medium">Игры</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'profile' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="User" size={24} />
          <span className="text-xs font-medium">Профиль</span>
        </button>
      </nav>
    </div>
  );
};

export default Index;
