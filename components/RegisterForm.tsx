import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

interface RegisterFormProps {
  onRegister: (email: string, password: string, name: string) => void;
  onSwitchToLogin: () => void;
  onShowPrivacy: () => void;
  isLoading: boolean;
}

export function RegisterForm({ onRegister, onSwitchToLogin, onShowPrivacy, isLoading }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      name: ""
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Имя обязательно";
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Email обязателен";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Неверный формат email";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Пароль обязателен";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Подтверждение пароля обязательно";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onRegister(email, password, name.trim());
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Создать аккаунт</h3>
        <p className="text-gray-400">Присоединяйтесь к сообществу Aureus</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300 text-sm font-medium">
            ИМЯ ПОЛЬЗОВАТЕЛЯ
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`
              bg-gray-800 border-gray-700 text-white placeholder-gray-500
              focus:border-indigo-500 focus:ring-indigo-500 rounded-md
              ${errors.name ? 'border-red-500' : ''}
            `}
            placeholder="Введите ваше имя"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-red-400">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
            EMAIL
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`
              bg-gray-800 border-gray-700 text-white placeholder-gray-500
              focus:border-indigo-500 focus:ring-indigo-500 rounded-md
              ${errors.email ? 'border-red-500' : ''}
            `}
            placeholder="example@mail.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
            ПАРОЛЬ
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`
                bg-gray-800 border-gray-700 text-white placeholder-gray-500
                focus:border-indigo-500 focus:ring-indigo-500 rounded-md pr-10
                ${errors.password ? 'border-red-500' : ''}
              `}
              placeholder="Введите пароль"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium">
            ПОДТВЕРДИТЕ ПАРОЛЬ
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`
                bg-gray-800 border-gray-700 text-white placeholder-gray-500
                focus:border-indigo-500 focus:ring-indigo-500 rounded-md pr-10
                ${errors.confirmPassword ? 'border-red-500' : ''}
              `}
              placeholder="Повторите пароль"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-400">{errors.confirmPassword}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-md transition-colors duration-200" 
          disabled={isLoading}
        >
          {isLoading ? "Регистрация..." : "Создать аккаунт"}
        </Button>
        
        <div className="text-xs text-gray-500 leading-relaxed">
          Регистрируясь, вы соглашаетесь с{" "}
          <Button variant="link" className="text-indigo-400 hover:text-indigo-300 p-0 h-auto text-xs">
            Условиями использования
          </Button>
          {" "}и{" "}
          <Button 
            type="button"
            variant="link" 
            className="text-indigo-400 hover:text-indigo-300 p-0 h-auto text-xs"
            onClick={onShowPrivacy}
            disabled={isLoading}
          >
            Политикой конфиденциальности
          </Button>
        </div>

        <div className="text-sm text-gray-400">
          Уже есть аккаунт?{" "}
          <Button
            type="button"
            variant="link"
            className="text-indigo-400 hover:text-indigo-300 p-0 h-auto font-normal"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            Войти
          </Button>
        </div>
      </form>
    </div>
  );
}