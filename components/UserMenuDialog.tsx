import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { 
  Settings, 
  Moon, 
  Sun, 
  Palette,
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  CircleCheck,
  Volume2,
  Keyboard,
  Languages,
  Download,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";

interface UserMenuDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
  onLogout: () => void;
  onThemeChange: (theme: string) => void;
  userProfile: {
    id: number;
    name: string;
    avatar: string;
  };
  theme: string;
}

export function UserMenuDialog({ 
  isOpen, 
  onClose, 
  onSettingsClick, 
  onLogout, 
  onThemeChange,
  userProfile,
  theme 
}: UserMenuDialogProps) {
  
  const handleSettingsClick = () => {
    onSettingsClick();
    onClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'blue'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    onThemeChange(themes[nextIndex]);
  };

  const showNotification = (message: string) => {
    toast.info(message);
  };

  const toggleOnlineStatus = () => {
    // В реальном приложении бы отправляли запрос на сервер
    toast.success("Статус изменен на оффлайн. Вы будете выглядеть неактивным для других пользователей.");
  };

  const downloadApp = () => {
    toast.info("Скачивание мобильного приложения Aureus скоро будет доступно!");
  };

  const changeLanguage = () => {
    toast.info("Поддержка других языков (English, Deutsch, Français) будет добавлена в следующих обновлениях!");
  };

  const syncDevices = () => {
    toast.success("Синхронизация с другими устройствами завершена! Все ваши чаты и настройки актуальны.");
  };

  const getThemeIcon = () => {
    switch(theme) {
      case 'dark': return <Moon className="h-4 w-4" />;
      case 'blue': return <Palette className="h-4 w-4" />;
      default: return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeName = () => {
    switch(theme) {
      case 'dark': return 'Темная тема';
      case 'blue': return 'Синяя тема';
      default: return 'Светлая тема';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Меню пользователя</DialogTitle>
          <DialogDescription>Управление профилем и настройками</DialogDescription>
        </DialogHeader>
        {/* User Profile Header */}
        <div className="p-4 bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-primary"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{userProfile.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-100">
                  Онлайн
                </Badge>
                <span className="text-xs opacity-70">ID: {userProfile.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          {/* Status */}
          <div className="mb-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 p-3 h-auto"
              onClick={toggleOnlineStatus}
            >
              <CircleCheck className="h-4 w-4 text-green-500" />
              <div className="flex-1 text-left">
                <p className="font-medium">Онлайн</p>
                <p className="text-xs text-muted-foreground">Нажмите, чтобы стать невидимым</p>
              </div>
            </Button>
          </div>

          <Separator className="my-2" />

          {/* Settings & Preferences */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 p-3"
              onClick={handleSettingsClick}
            >
              <Settings className="h-4 w-4" />
              Настройки аккаунта
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 p-3"
              onClick={cycleTheme}
            >
              {getThemeIcon()}
              <span className="flex-1 text-left">{getThemeName()}</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 p-3"
              onClick={() => showNotification("Настройки уведомлений будут добавлены в следующем обновлении!")}
            >
              <Bell className="h-4 w-4" />
              Уведомления
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 p-3"
              onClick={() => showNotification("Настройки звука будут добавлены в следующем обновлении!")}
            >
              <Volume2 className="h-4 w-4" />
              Звуки и голос
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 p-3"
              onClick={() => showNotification("Горячие клавиши: Ctrl+N - новый чат, Ctrl+S - настройки, Ctrl+F - поиск, Esc - закрыть диалоги")}
            >
              <Keyboard className="h-4 w-4" />
              Горячие клавиши
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 p-3"
              onClick={changeLanguage}
            >
              <Languages className="h-4 w-4" />
              Язык интерфейса
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 p-3"
              onClick={downloadApp}
            >
              <Download className="h-4 w-4" />
              Скачать приложение
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 p-3"
              onClick={syncDevices}
            >
              <Monitor className="h-4 w-4" />
              Синхронизация устройств
            </Button>
          </div>

          <Separator className="my-2" />

          {/* Privacy & Support */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 p-3"
              onClick={() => showNotification("Настройки приватности будут добавлены в следующем обновлении!")}
            >
              <Shield className="h-4 w-4" />
              Приватность и безопасность
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 p-3"
              onClick={() => showNotification("Aureus v1.0 - Современный мессенджер для всех!\nПоддержка: support@aureus.com")}
            >
              <HelpCircle className="h-4 w-4" />
              Справка и поддержка
            </Button>
          </div>

          <Separator className="my-2" />

          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 p-3 text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
            onClick={handleLogoutClick}
          >
            <LogOut className="h-4 w-4" />
            Выйти из аккаунта
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}