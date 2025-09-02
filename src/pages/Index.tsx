import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';

interface Equipment {
  id: string;
  department: string;
  address: string;
  inventoryNumber: string;
  fullName: string;
  ipAddress: string;
  hddNumber: string;
  macAddress: string;
}

interface Department {
  name: string;
  ipRange: string;
  equipmentCount: number;
  usedIPs: string[];
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [departments, setDepartments] = useState<Department[]>([
    { name: 'IT Отдел', ipRange: '192.168.1.1-50', equipmentCount: 12, usedIPs: ['192.168.1.10', '192.168.1.11'] },
    { name: 'Бухгалтерия', ipRange: '192.168.2.1-50', equipmentCount: 8, usedIPs: ['192.168.2.5'] },
    { name: 'HR Отдел', ipRange: '192.168.3.1-50', equipmentCount: 5, usedIPs: [] },
    { name: 'Отдел продаж', ipRange: '192.168.4.1-50', equipmentCount: 15, usedIPs: ['192.168.4.2', '192.168.4.3'] },
  ]);

  // Имитация данных оборудования
  useEffect(() => {
    if (isLoggedIn) {
      setEquipment([
        {
          id: '1',
          department: 'IT Отдел',
          address: 'Кабинет 101',
          inventoryNumber: 'INV001',
          fullName: 'Иванов Иван Иванович',
          ipAddress: '192.168.1.10',
          hddNumber: 'HDD12345',
          macAddress: '00:1B:44:11:3A:B7'
        },
        {
          id: '2',
          department: 'Бухгалтерия',
          address: 'Кабинет 201',
          inventoryNumber: 'INV002',
          fullName: 'Петрова Анна Сергеевна',
          ipAddress: '192.168.2.5',
          hddNumber: 'HDD67890',
          macAddress: '00:1B:44:11:3A:B8'
        },
      ]);
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Простая проверка логина (в реальном проекте будет через API)
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('Неверный логин или пароль');
    }
  };

  const validateIPAddress = (ip: string, departmentName: string): boolean => {
    const dept = departments.find(d => d.name === departmentName);
    if (!dept) return false;
    
    // Проверяем, что IP не используется в этом отделе
    return !dept.usedIPs.includes(ip);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Icon name="Shield" size={48} className="text-primary" />
            </div>
            <CardTitle className="text-2xl text-center font-semibold">
              Система учета IT-оборудования
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Введите данные для входа в систему
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Логин</Label>
                <Input
                  id="username"
                  placeholder="Введите логин"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Войти в систему
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Для демонстрации используйте: admin / admin
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Icon name="Database" size={32} className="text-primary" />
            <h1 className="text-2xl font-semibold text-slate-900">
              IT Asset Management
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-sm">
              Администратор: {username}
            </Badge>
            <Button 
              variant="outline" 
              onClick={() => setIsLoggedIn(false)}
              size="sm"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Icon name="BarChart3" size={16} />
              <span>Панель управления</span>
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center space-x-2">
              <Icon name="Building2" size={16} />
              <span>Подразделения</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center space-x-2">
              <Icon name="Monitor" size={16} />
              <span>Оборудование</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <Icon name="FileText" size={16} />
              <span>Отчеты</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Всего подразделений
                  </CardTitle>
                  <Icon name="Building2" size={16} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{departments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    из 10 возможных
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Единиц оборудования
                  </CardTitle>
                  <Icon name="Monitor" size={16} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {departments.reduce((acc, dept) => acc + dept.equipmentCount, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    активное оборудование
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Использовано IP
                  </CardTitle>
                  <Icon name="Wifi" size={16} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {departments.reduce((acc, dept) => acc + dept.usedIPs.length, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    из 200 доступных
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Активные пользователи
                  </CardTitle>
                  <Icon name="Users" size={16} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    в системе сейчас
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Department Status Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Статистика по подразделениям</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="w-full h-48 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img 
                        src="/img/ec3729c2-30ba-42c0-ad18-c7e1baa2778f.jpg" 
                        alt="Dashboard Statistics"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-3">
                      {departments.map((dept, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium">{dept.name}</p>
                            <p className="text-sm text-muted-foreground">
                              IP: {dept.ipRange}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">{dept.equipmentCount}</p>
                            <p className="text-xs text-muted-foreground">единиц</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Последние изменения</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="Plus" size={16} className="text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Добавлено оборудование</p>
                        <p className="text-xs text-muted-foreground">
                          IT Отдел • 2 часа назад
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Icon name="Edit" size={16} className="text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Обновлен IP-адрес</p>
                        <p className="text-xs text-muted-foreground">
                          Бухгалтерия • 4 часа назад
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Icon name="Trash2" size={16} className="text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Списано оборудование</p>
                        <p className="text-xs text-muted-foreground">
                          HR Отдел • 1 день назад
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Управление подразделениями</h2>
              <Button>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить подразделение
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                      <Badge variant="secondary">
                        {dept.equipmentCount} единиц
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">IP Диапазон</Label>
                      <p className="text-sm text-muted-foreground">{dept.ipRange}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Использовано IP</Label>
                      <p className="text-sm text-muted-foreground">
                        {dept.usedIPs.length} / 50 адресов
                      </p>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(dept.usedIPs.length / 50) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Icon name="Edit" size={14} className="mr-1" />
                        Изменить
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icon name="Settings" size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Учет оборудования</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить оборудование
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Добавление нового оборудования</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Подразделение</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите подразделение" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept, index) => (
                            <SelectItem key={index} value={dept.name}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Адрес</Label>
                      <Input placeholder="Кабинет 101" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inventoryNumber">Инвентарный номер</Label>
                      <Input placeholder="INV001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">ФИО ответственного</Label>
                      <Input placeholder="Иванов Иван Иванович" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ipAddress">IP-адрес</Label>
                      <Input placeholder="192.168.1.10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hddNumber">Номер НЖМД</Label>
                      <Input placeholder="HDD12345" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="macAddress">MAC-адрес</Label>
                      <Input placeholder="00:1B:44:11:3A:B7" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline">Отмена</Button>
                    <Button>Добавить</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Список оборудования</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Подразделение</TableHead>
                      <TableHead>Адрес</TableHead>
                      <TableHead>Инв. №</TableHead>
                      <TableHead>ФИО</TableHead>
                      <TableHead>IP-адрес</TableHead>
                      <TableHead>№ НЖМД</TableHead>
                      <TableHead>MAC-адрес</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipment.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.department}</TableCell>
                        <TableCell>{item.address}</TableCell>
                        <TableCell>{item.inventoryNumber}</TableCell>
                        <TableCell>{item.fullName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {item.ipAddress}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{item.hddNumber}</TableCell>
                        <TableCell className="font-mono text-xs">{item.macAddress}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Icon name="Edit" size={14} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Генерация отчетов</h2>
              <Button>
                <Icon name="Download" size={16} className="mr-2" />
                Экспорт в Excel
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Icon name="Building2" size={24} className="text-primary" />
                    <CardTitle>По подразделениям</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Сводный отчет по всем подразделениям с количеством оборудования и использованием IP
                  </p>
                  <Button variant="outline" className="w-full">
                    Создать отчет
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Icon name="Monitor" size={24} className="text-primary" />
                    <CardTitle>По оборудованию</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Детальный отчет по каждой единице оборудования с техническими характеристиками
                  </p>
                  <Button variant="outline" className="w-full">
                    Создать отчет
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Icon name="Wifi" size={24} className="text-primary" />
                    <CardTitle>Использование IP</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Анализ использования IP-адресов по подразделениям и свободные адреса
                  </p>
                  <Button variant="outline" className="w-full">
                    Создать отчет
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;