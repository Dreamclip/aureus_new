import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
  isLoading: boolean;
}

export function LoginForm({ onLogin, onSwitchToRegister, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin(email, password);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">С возвращением!</h3>
        <p className="text-gray-400">Мы рады видеть вас снова</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
            EMAIL ИЛИ НОМЕР ТЕЛЕФОНА
          </Label>
          <div className="relative">
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
              placeholder="Введите email"
              disabled={isLoading}
            />
          </div>
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

        <Button
          type="button"
          variant="link"
          className="text-indigo-400 hover:text-indigo-300 p-0 h-auto text-sm"
          disabled={isLoading}
        >
          Забыли пароль?
        </Button>

        <Button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-md transition-colors duration-200" 
          disabled={isLoading}
        >
          {isLoading ? "Вход..." : "Войти"}
        </Button>
        
        <div className="text-sm text-gray-400">
          Нет аккаунта?{" "}
          <Button
            type="button"
            variant="link"
            className="text-indigo-400 hover:text-indigo-300 p-0 h-auto font-normal"
            onClick={onSwitchToRegister}
            disabled={isLoading}
          >
            Зарегистрироваться
          </Button>
        </div>
      </form>
    </div>
  );
}