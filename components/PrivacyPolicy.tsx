import { ArrowLeft, Shield, Lock, Eye, Database, Mail, Phone, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к регистрации
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-indigo-600" />
              <h1 className="text-xl font-semibold">Политика конфиденциальности</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold">Введение</h2>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-indigo-800">
                Последнее обновление: 12 сентября 2025
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Компания ООО "Ауреус Текнолоджи" ("мы", "наша компания") уважает вашу конфиденциальность 
              и обязуется защищать ваши персональные данные. Данная политика конфиденциальности 
              объясняет, как мы собираем, используем и защищаем информацию при использовании 
              мессенджера Aureus.
            </p>
          </section>

          <Separator />

          {/* Data Collection */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Database className="h-4 w-4 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Сбор персональных данных</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-medium mb-2">Данные аккаунта:</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Имя пользователя и отображаемое имя</li>
                  <li>• Адрес электронной почты</li>
                  <li>• Аватар профиля (при загрузке)</li>
                  <li>• Дата создания аккаунта</li>
                </ul>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-medium mb-2">Данные сообщений:</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Содержимое отправленных сообщений</li>
                  <li>• Время отправки и доставки</li>
                  <li>• Статус прочтения сообщений</li>
                  <li>• Медиафайлы (фото, документы)</li>
                </ul>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium mb-2">Технические данные:</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• IP-адрес и информация об устройстве</li>
                  <li>• Данные о браузере и операционной системе</li>
                  <li>• Логи активности в приложении</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Data Usage */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Globe className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Использование данных</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-gray-900">Основные цели:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Обеспечение работы мессенджера</li>
                  <li>✓ Доставка сообщений между пользователями</li>
                  <li>✓ Синхронизация данных между устройствами</li>
                  <li>✓ Обеспечение безопасности аккаунта</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-gray-900">Дополнительные цели:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Улучшение качества сервиса</li>
                  <li>✓ Анализ использования функций</li>
                  <li>✓ Предотвращение мошенничества</li>
                  <li>✓ Техническая поддержка</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Lock className="h-4 w-4 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold">Защита данных</h2>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Шифрование</span>
              </div>
              <p className="text-sm text-red-700">
                Все сообщения шифруются с использованием протокола TLS и хранятся 
                в зашифрованном виде на наших серверах.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">Меры безопасности:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>256-битное AES шифрование</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Двухфакторная аутентификация</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Регулярные аудиты безопасности</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Защищенные дата-центры</span>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* User Rights */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold">Ваши права</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Доступ к данным</h4>
                    <p className="text-sm text-gray-600">Получить копию всех ваших данных</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Исправление</h4>
                    <p className="text-sm text-gray-600">Исправить неточные данные</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Удаление</h4>
                    <p className="text-sm text-gray-600">Удалить ваш аккаунт и данные</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-blue-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Ограничение</h4>
                    <p className="text-sm text-gray-600">Ограничить обработку данных</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Contact */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold">Контакты</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">
                По вопросам конфиденциальности обращайтесь:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>privacy@aureus.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>+7 (800) 555-0199</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span>Москва, ул. Тверская, д. 1, офис 100</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="text-center py-8">
          <p className="text-sm text-gray-500">
            © 2025 ООО "Ауреус Текнолоджи". Все права защищены.
          </p>
        </footer>
      </main>
    </div>
  );
}