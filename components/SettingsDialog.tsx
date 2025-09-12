import { useState } from "react";
import { User, Palette, Camera, Hash, LogOut, Upload, Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
}

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  userProfile: UserProfile;
  onUserProfileUpdate: (profile: { display_name: string; avatar_url: string }) => Promise<boolean>;
  onLogout?: () => void;
}

const themes = [
  { id: "light", name: "Светлая", description: "Классическая светлая тема" },
  { id: "dark", name: "Темная", description: "Темная тема для работы в ночное время" },
  { id: "blue", name: "Синяя", description: "Стильная синяя тема" }
];

// Generate avatar colors for simple letter avatars
const avatarColors = [
  { bg: "#5865f2", color: "#ffffff" },
  { bg: "#57f287", color: "#000000" },
  { bg: "#fee75c", color: "#000000" },
  { bg: "#eb459e", color: "#ffffff" },
  { bg: "#ed4245", color: "#ffffff" },
  { bg: "#00d9ff", color: "#000000" }
];

export function SettingsDialog({ 
  isOpen, 
  onClose, 
  theme, 
  onThemeChange, 
  userProfile, 
  onUserProfileUpdate,
  onLogout
}: SettingsDialogProps) {
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempAvatar, setTempAvatar] = useState(userProfile.avatar);
  const [tempTheme, setTempTheme] = useState(theme);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      onThemeChange(tempTheme);
      
      // Update avatar with current name if it's a generated one
      let finalAvatar = tempAvatar;
      if (tempAvatar.includes('ui-avatars.com')) {
        const currentColor = avatarColors.find(c => 
          tempAvatar.includes(`background=${c.bg.slice(1)}`)
        ) || avatarColors[0];
        finalAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(tempName)}&background=${currentColor.bg.slice(1)}&color=${currentColor.color.slice(1)}&size=128`;
      }
      
      const success = await onUserProfileUpdate({
        display_name: tempName,
        avatar_url: finalAvatar
      });

      if (success) {
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTempName(userProfile.name);
    setTempAvatar(userProfile.avatar);
    setTempTheme(theme);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Настройки
          </DialogTitle>
          <DialogDescription>
            Управление профилем, темой и другими настройками приложения
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User ID */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">ID пользователя</p>
              <p className="text-lg text-primary font-mono">{userProfile.id.slice(0, 8)}...</p>
            </div>
          </div>

          <Separator />

          {/* Profile Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <h3 className="font-medium">Профиль</h3>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Введите ваше имя"
              />
            </div>

            {/* Avatar Selection */}
            <div className="space-y-3">
              <Label>Аватар</Label>
              
              {/* Current Avatar Display */}
              <div className="flex items-center gap-4 p-3 rounded-lg border">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={tempAvatar} alt="Current Avatar" />
                  <AvatarFallback>{tempName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">Текущий аватар</p>
                  <p className="text-sm text-muted-foreground">
                    {tempAvatar.includes('ui-avatars.com') ? 'Автогенерируемый' : 'Загружен пользователем'}
                  </p>
                </div>
              </div>

              {/* Upload Custom Avatar */}
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const result = e.target?.result as string;
                          setTempAvatar(result);
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Загрузить изображение
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG или GIF. Максимум 5MB.
                </p>
              </div>

              {/* Generated Avatar Options */}
              <div className="space-y-2">
                <Label className="text-sm">Или выберите стиль:</Label>
                <div className="grid grid-cols-3 gap-2">
                  {avatarColors.map((colorScheme, index) => {
                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(tempName || 'User')}&background=${colorScheme.bg.slice(1)}&color=${colorScheme.color.slice(1)}&size=128`;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setTempAvatar(avatarUrl)}
                        className={`
                          relative p-1 rounded-lg border-2 transition-colors
                          ${tempAvatar === avatarUrl 
                            ? 'border-primary' 
                            : 'border-transparent hover:border-muted-foreground'
                          }
                        `}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={avatarUrl} alt={`Avatar ${index + 1}`} />
                          <AvatarFallback style={{ backgroundColor: colorScheme.bg, color: colorScheme.color }}>
                            {tempName?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Theme Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <h3 className="font-medium">Тема оформления</h3>
            </div>

            <RadioGroup value={tempTheme} onValueChange={setTempTheme}>
              {themes.map((themeOption) => (
                <div key={themeOption.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={themeOption.id} id={themeOption.id} />
                  <div className="flex-1">
                    <Label htmlFor={themeOption.id} className="font-medium">
                      {themeOption.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {themeOption.description}
                    </p>
                  </div>
                  <div className={`
                    w-6 h-6 rounded-full border-2 border-border
                    ${themeOption.id === 'light' ? 'bg-white' : ''}
                    ${themeOption.id === 'dark' ? 'bg-gray-900' : ''}
                    ${themeOption.id === 'blue' ? 'bg-blue-600' : ''}
                  `} />
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleCancel} variant="outline" className="flex-1" disabled={saving}>
              Отмена
            </Button>
            <Button onClick={handleSave} className="flex-1" disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>

          {/* Logout Button */}
          {onLogout && (
            <>
              <Separator />
              <Button 
                onClick={() => {
                  onLogout();
                  onClose();
                }} 
                variant="destructive" 
                className="w-full"
                disabled={saving}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти из аккаунта
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}