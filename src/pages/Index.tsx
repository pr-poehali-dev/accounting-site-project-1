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
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';

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

  // Состояние формы добавления оборудования
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    department: '',
    address: '',
    inventoryNumber: '',
    fullName: '',
    ipAddress: '',
    hddNumber: '',
    macAddress: ''
  });
  const [ipValidation, setIpValidation] = useState({ isValid: true, message: '' });

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

  // Функции валидации и управления формой
  const validateIPAddress = (ip: string, departmentName: string) => {
    // Проверка формата IP
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    if (!ipRegex.test(ip)) {
      return { isValid: false, message: 'Неверный формат IP-адреса' };
    }

    const dept = departments.find(d => d.name === departmentName);
    if (!dept) {
      return { isValid: false, message: 'Подразделение не найдено' };
    }
    
    // Проверяем диапазон IP для подразделения
    const [rangeStart, rangeEnd] = dept.ipRange.split('-');
    const ipParts = rangeStart.split('.');
    const baseIP = ipParts.slice(0, 3).join('.');
    const startNum = parseInt(ipParts[3]);
    const endNum = parseInt(rangeEnd);
    const currentIpParts = ip.split('.');
    const currentBase = currentIpParts.slice(0, 3).join('.');
    const currentNum = parseInt(currentIpParts[3] || '0');
    
    if (currentBase !== baseIP || currentNum < startNum || currentNum > endNum) {
      return { isValid: false, message: `IP должен быть в диапазоне ${dept.ipRange}` };
    }
    
    // Проверяем, что IP не используется
    if (dept.usedIPs.includes(ip)) {
      return { isValid: false, message: 'Данный IP-адрес уже используется в подразделении' };
    }

    return { isValid: true, message: 'IP-адрес доступен' };
  };

  const validateMACAddress = (mac: string) => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
  };

  const handleIPChange = (value: string) => {
    setNewEquipment(prev => ({ ...prev, ipAddress: value }));
    
    if (value && newEquipment.department) {
      const validation = validateIPAddress(value, newEquipment.department);
      setIpValidation(validation);
    } else {
      setIpValidation({ isValid: true, message: '' });
    }
  };

  const handleDepartmentChange = (value: string) => {
    setNewEquipment(prev => ({ ...prev, department: value }));
    
    if (newEquipment.ipAddress && value) {
      const validation = validateIPAddress(newEquipment.ipAddress, value);
      setIpValidation(validation);
    }
  };

  const handleAddEquipment = () => {
    // Проверяем все поля
    if (!newEquipment.department || !newEquipment.address || !newEquipment.inventoryNumber || 
        !newEquipment.fullName || !newEquipment.ipAddress || !newEquipment.hddNumber || !newEquipment.macAddress) {
      alert('Заполните все обязательные поля');
      return;
    }

    // Проверяем валидность IP и MAC
    const ipValidation = validateIPAddress(newEquipment.ipAddress, newEquipment.department);
    if (!ipValidation.isValid) {
      alert(ipValidation.message);
      return;
    }

    if (!validateMACAddress(newEquipment.macAddress)) {
      alert('Неверный формат MAC-адреса');
      return;
    }

    // Добавляем оборудование
    const newItem: Equipment = {
      id: Date.now().toString(),
      ...newEquipment
    };

    setEquipment(prev => [...prev, newItem]);

    // Обновляем счетчик и используемые IP в подразделении
    setDepartments(prev => prev.map(dept => 
      dept.name === newEquipment.department 
        ? { 
            ...dept, 
            equipmentCount: dept.equipmentCount + 1,
            usedIPs: [...dept.usedIPs, newEquipment.ipAddress]
          }
        : dept
    ));

    // Сбрасываем форму
    setNewEquipment({
      department: '',
      address: '',
      inventoryNumber: '',
      fullName: '',
      ipAddress: '',
      hddNumber: '',
      macAddress: ''
    });
    setIpValidation({ isValid: true, message: '' });
    setIsAddDialogOpen(false);
  };

  const exportToExcel = (reportType: string) => {
    let data: any[] = [];
    let filename = '';

    switch (reportType) {
      case 'departments':
        data = departments.map(dept => ({
          'Подразделение': dept.name,
          'IP Диапазон': dept.ipRange,
          'Количество оборудования': dept.equipmentCount,
          'Используемые IP': dept.usedIPs.join(', ') || 'Не используются'
        }));
        filename = 'Отчет_по_подразделениям.xlsx';
        break;
      
      case 'equipment':
        data = equipment.map(item => ({
          'Подразделение': item.department,
          'Адрес': item.address,
          'Инвентарный номер': item.inventoryNumber,
          'ФИО ответственного': item.fullName,
          'IP-адрес': item.ipAddress,
          'Номер НЖМД': item.hddNumber,
          'MAC-адрес': item.macAddress
        }));
        filename = 'Отчет_по_оборудованию.xlsx';
        break;
      
      case 'ip':
        data = departments.flatMap(dept => 
          dept.usedIPs.map(ip => ({
            'Подразделение': dept.name,
            'IP-адрес': ip,
            'Статус': 'Используется'
          }))
        );
        filename = 'Отчет_использование_IP.xlsx';
        break;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Отчет');
    XLSX.writeFile(workbook, filename);
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
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                      <Label htmlFor="department">Подразделение *</Label>
                      <Select value={newEquipment.department} onValueChange={handleDepartmentChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите подразделение" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept, index) => (
                            <SelectItem key={index} value={dept.name}>
                              {dept.name} (IP: {dept.ipRange})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Адрес *</Label>
                      <Input 
                        placeholder="Кабинет 101" 
                        value={newEquipment.address}
                        onChange={(e) => setNewEquipment(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inventoryNumber">Инвентарный номер *</Label>
                      <Input 
                        placeholder="INV001" 
                        value={newEquipment.inventoryNumber}
                        onChange={(e) => setNewEquipment(prev => ({ ...prev, inventoryNumber: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">ФИО ответственного *</Label>
                      <Input 
                        placeholder="Иванов Иван Иванович" 
                        value={newEquipment.fullName}
                        onChange={(e) => setNewEquipment(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ipAddress">IP-адрес *</Label>
                      <Input 
                        placeholder="192.168.1.10" 
                        value={newEquipment.ipAddress}
                        onChange={(e) => handleIPChange(e.target.value)}
                        className={!ipValidation.isValid && ipValidation.message ? 'border-red-500' : ''}
                      />
                      {ipValidation.message && (
                        <Alert className={ipValidation.isValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                          <Icon name={ipValidation.isValid ? "CheckCircle2" : "AlertCircle"} size={16} />
                          <AlertDescription className={ipValidation.isValid ? 'text-green-700' : 'text-red-700'}>
                            {ipValidation.message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hddNumber">Номер НЖМД *</Label>
                      <Input 
                        placeholder="HDD12345" 
                        value={newEquipment.hddNumber}
                        onChange={(e) => setNewEquipment(prev => ({ ...prev, hddNumber: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="macAddress">MAC-адрес *</Label>
                      <Input 
                        placeholder="00:1B:44:11:3A:B7" 
                        value={newEquipment.macAddress}
                        onChange={(e) => setNewEquipment(prev => ({ ...prev, macAddress: e.target.value.toUpperCase() }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button 
                      onClick={handleAddEquipment}
                      disabled={!ipValidation.isValid && ipValidation.message !== ''}
                    >
                      Добавить оборудование
                    </Button>
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
              <Button onClick={() => exportToExcel('equipment')}>
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
                  <Button variant="outline" className="w-full" onClick={() => exportToExcel('departments')}>
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
                  <Button variant="outline" className="w-full" onClick={() => exportToExcel('equipment')}>
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
                  <Button variant="outline" className="w-full" onClick={() => exportToExcel('ip')}>
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