'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Plus,
  Shield,
  Layers,
  BookOpen,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Database,
  Lock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

type UserRole = 'ADMIN' | 'EVALUATOR' | 'CONSULTANT';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface AdminFamily {
  id: string;
  code: string;
  name: string;
  description: string;
  standardsCount: number;
}

interface AdminStandard {
  id: string;
  familyCode: string;
  code: string;
  title: string;
  shortTitle: string;
  edition: string;
  category: string;
  targetAudience: string;
  purpose: string;
  introduction: string;
  officialUrl: string;
  accessType: string;
  sectionsCount: number;
  itemsCount: number;
}

interface Permissions {
  role: UserRole;
  roleLabel: string;
  canManageUsers: boolean;
  canManageFamiliesAndStandards: boolean;
  canEditEvaluations: boolean;
  canReadLibraryAndReports: boolean;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'families' | 'standards'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [families, setFamilies] = useState<AdminFamily[]>([]);
  const [standards, setStandards] = useState<AdminStandard[]>([]);
  const [permissions, setPermissions] = useState<Permissions>({
    role: 'ADMIN',
    roleLabel: 'Administrador (GP / Configuración)',
    canManageUsers: true,
    canManageFamiliesAndStandards: true,
    canEditEvaluations: true,
    canReadLibraryAndReports: true,
  });
  const [dataSource, setDataSource] = useState<string>('SUPABASE_POSTGRES');
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Estados para formulario de Nuevo Usuario (RBAC)
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('Password123!');
  const [newUserRole, setNewUserRole] = useState<UserRole>('EVALUATOR');

  // Estados para formulario de Nueva Familia (Extensibilidad ISO 9001 / ISO 25010)
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [newFamilyCode, setNewFamilyCode] = useState('');
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newFamilyDesc, setNewFamilyDesc] = useState('');

  // Estados para formulario de Nueva Norma / Parte y Apartado inicial (RF-15)
  const [showStandardForm, setShowStandardForm] = useState(false);
  const [stdFamilyCode, setStdFamilyCode] = useState('ISO-29110');
  const [stdCode, setStdCode] = useState('');
  const [stdShortTitle, setStdShortTitle] = useState('');
  const [stdTitle, setStdTitle] = useState('');
  const [stdEdition, setStdEdition] = useState('2025');
  const [stdCategory, setStdCategory] = useState('GUIDELINES');
  const [stdAccessType, setStdAccessType] = useState('ISO_PAID');
  const [stdAudience, setStdAudience] = useState('Equipos de desarrollo y auditores de calidad');
  const [stdPurpose, setStdPurpose] = useState('');
  const [stdIntro, setStdIntro] = useState('');
  const [stdUrl, setStdUrl] = useState('https://www.iso.org/standards.html');
  const [secCode, setSecCode] = useState('REQ.1');
  const [secName, setSecName] = useState('Requisitos Generales de Conformidad');
  const [itemCode, setItemCode] = useState('REQ.1.1');
  const [itemStatement, setItemStatement] = useState('');
  const [itemDeliverable, setItemDeliverable] = useState('Evidencia documentada verificada');
  const [itemRole, setItemRole] = useState('GP');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      if (data.users) setUsers(data.users);
      if (data.families) setFamilies(data.families);
      if (data.standards) setStandards(data.standards);
      if (data.permissions) setPermissions(data.permissions);
      if (data.source) setDataSource(data.source);
    } catch {
      setFeedback({ type: 'error', message: 'Error al cargar datos de administración.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const onRoleChange = () => fetchAdminData();
    window.addEventListener('iso-role-changed', onRoleChange);
    return () => window.removeEventListener('iso-role-changed', onRoleChange);
  }, []);

  const notify = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  // --- Acciones Usuarios RBAC ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entity: 'user',
        action: 'create',
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      notify('error', data.error || 'No se pudo crear el usuario.');
      return;
    }
    notify('success', `Usuario ${newUserEmail} registrado con contraseña cifrada bcrypt y rol ${newUserRole}.`);
    setNewUserName('');
    setNewUserEmail('');
    setShowUserForm(false);
    fetchAdminData();
  };

  const handleRoleChange = async (userId: string, role: UserRole) => {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity: 'user', action: 'update_role', userId, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      notify('error', data.error || 'No se pudo actualizar el rol.');
      return;
    }
    notify('success', `Rol RBAC actualizado a ${role}.`);
    fetchAdminData();
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (email === 'admin@espe.edu.ec') {
      notify('error', 'No se puede eliminar la cuenta principal del Gestor de Proyecto (Admin).');
      return;
    }
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity: 'user', action: 'delete', userId }),
    });
    if (res.ok) {
      notify('success', `Usuario ${email} eliminado.`);
      fetchAdminData();
    }
  };

  // --- Acciones Familias Extensibles ---
  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entity: 'family',
        action: 'create',
        code: newFamilyCode,
        name: newFamilyName,
        description: newFamilyDesc,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      notify('error', data.error || 'No se pudo registrar la familia.');
      return;
    }
    notify('success', `Familia extensible ${newFamilyCode} registrada en la base de datos sin modificar código fuente.`);
    setNewFamilyCode('');
    setNewFamilyName('');
    setNewFamilyDesc('');
    setShowFamilyForm(false);
    fetchAdminData();
  };

  const handleQuickPresetFamily = (preset: 'ISO-9001' | 'ISO-25010') => {
    setShowFamilyForm(true);
    if (preset === 'ISO-9001') {
      setNewFamilyCode('ISO-9001');
      setNewFamilyName('Familia ISO 9001:2015 — Sistemas de Gestión de la Calidad');
      setNewFamilyDesc(
        'Requisitos internacionales para un Sistema de Gestión de la Calidad (SGC) orientado a la mejora continua y satisfacción del cliente.'
      );
    } else {
      setNewFamilyCode('ISO-25010');
      setNewFamilyName('Familia ISO/IEC 25010:2023 (SQuaRE) — Calidad de Producto de Software');
      setNewFamilyDesc(
        'Modelo de calidad del producto de software y sistemas (adecuación funcional, eficiencia, compatibilidad, usabilidad, fiabilidad, seguridad, mantenibilidad y portabilidad).'
      );
    }
  };

  const handleDeleteFamily = async (familyId: string, code: string) => {
    if (code === 'ISO-29110') {
      notify('error', 'La familia base ISO-29110 es obligatoria para la rúbrica y no debe eliminarse.');
      return;
    }
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity: 'family', action: 'delete', familyId }),
    });
    if (res.ok) {
      notify('success', `Familia ${code} eliminada.`);
      fetchAdminData();
    }
  };

  // --- Acciones Normas y Apartados ---
  const handleUpsertStandard = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entity: 'standard',
        action: 'upsert',
        familyCode: stdFamilyCode,
        code: stdCode,
        shortTitle: stdShortTitle,
        title: stdTitle,
        edition: stdEdition,
        category: stdCategory,
        accessType: stdAccessType,
        targetAudience: stdAudience,
        purpose: stdPurpose,
        introduction: stdIntro,
        officialUrl: stdUrl,
        initialSectionCode: secCode,
        initialSectionName: secName,
        initialItemCode: itemCode,
        initialItemStatement: itemStatement,
        initialItemDeliverable: itemDeliverable,
        initialItemRole: itemRole,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      notify('error', data.error || 'No se pudo guardar la norma.');
      return;
    }
    notify('success', `Norma ${stdCode} y su apartado/ítem guardados correctamente.`);
    setShowStandardForm(false);
    setStdCode('');
    setStdShortTitle('');
    setStdTitle('');
    fetchAdminData();
  };

  const handleEditStandardLoad = (std: AdminStandard) => {
    setActiveTab('standards');
    setShowStandardForm(true);
    setStdFamilyCode(std.familyCode || 'ISO-29110');
    setStdCode(std.code);
    setStdShortTitle(std.shortTitle);
    setStdTitle(std.title);
    setStdEdition(std.edition);
    setStdCategory(std.category);
    setStdAccessType(std.accessType);
    setStdAudience(std.targetAudience);
    setStdPurpose(std.purpose);
    setStdIntro(std.introduction);
    setStdUrl(std.officialUrl);
  };

  const isAdmin = permissions.canManageUsers && permissions.canManageFamiliesAndStandards;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Cabecera M7 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200">
              RF-15 & RNF-03 • Responsable: Juan Quimbiulco (GP / Backend)
            </Badge>
            <Badge variant={dataSource === 'SUPABASE_POSTGRES' ? 'success' : 'secondary'}>
              <Database className="h-3 w-3 mr-1" />
              {dataSource === 'SUPABASE_POSTGRES' ? 'Supabase PostgreSQL Conectado' : 'Modo Local Seed'}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            M7. Módulo de Administración, Roles RBAC y Extensibilidad
          </h1>
          <p className="text-sm text-gray-500">
            Gestión de usuarios con contraseñas cifradas y registro extensible de nuevas familias de normas (ISO 9001, ISO/IEC 25010) sin modificar código.
          </p>
        </div>

        <Link href="/login">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Lock className="h-3.5 w-3.5 text-brand-600" />
            Probar Login Cifrado
          </Button>
        </Link>
      </div>

      {/* Aviso de Estado RBAC Actual */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isAdmin
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-200'
            : 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-200'
        }`}
      >
        <div className="flex items-start gap-3">
          {isAdmin ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-sm">
              Rol Activo en Sesión: {permissions.role} — {permissions.roleLabel}
            </p>
            {isAdmin ? (
              <p>
                Tienes privilegios completos de <strong>Administrador</strong> para crear/editar/eliminar usuarios, familias de normas, apartados e ítems.
              </p>
            ) : (
              <p>
                Modo protegido por <strong>RBAC (RNF-03)</strong>: El rol <code>{permissions.role}</code> tiene restringida la edición estructural en M7. Cambia a <strong>ADMIN</strong> en el selector superior para habilitar los controles de escritura.
              </p>
            )}
          </div>
        </div>
        <Badge variant={isAdmin ? 'success' : 'warning'}>
          {isAdmin ? 'Escritura Habilitada' : 'Solo Lectura en M7'}
        </Badge>
      </div>

      {/* Notificación de Feedback */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-brand-50 border-brand-200 text-brand-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-xs underline ml-4">
            Cerrar
          </button>
        </div>
      )}

      {/* Tarjetas de Resumen M7 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          onClick={() => setActiveTab('users')}
          className={`cursor-pointer transition-all ${
            activeTab === 'users' ? 'ring-2 ring-brand-600 border-brand-600' : 'hover:border-brand-300'
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardDescription className="text-xs font-semibold">1. Usuarios y Roles RBAC</CardDescription>
              <Users className="h-4 w-4 text-brand-600" />
            </div>
            <CardTitle className="text-2xl font-bold">{users.length} Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">ADMIN, EVALUATOR y CONSULTANT (Bcrypt)</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => setActiveTab('families')}
          className={`cursor-pointer transition-all ${
            activeTab === 'families' ? 'ring-2 ring-brand-600 border-brand-600' : 'hover:border-brand-300'
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardDescription className="text-xs font-semibold">2. Familias de Normas (Extensible)</CardDescription>
              <Layers className="h-4 w-4 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold">{families.length} Familias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {families.map((f) => (
                <Badge key={f.code} variant="outline" className="text-[10px]">
                  {f.code}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setActiveTab('standards')}
          className={`cursor-pointer transition-all ${
            activeTab === 'standards' ? 'ring-2 ring-brand-600 border-brand-600' : 'hover:border-brand-300'
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardDescription className="text-xs font-semibold">3. Catálogo de Normas y Apartados</CardDescription>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold">{standards.length} Partes</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="success">13 Partes Tabla 6 + Extensibles</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Pestañas de Navegación Interna M7 */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Shield className="h-4 w-4" /> Usuarios y Permisos RBAC
        </button>
        <button
          onClick={() => setActiveTab('families')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'families'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Layers className="h-4 w-4" /> Familias Extensibles (ISO 29110 / 9001 / 25010)
        </button>
        <button
          onClick={() => setActiveTab('standards')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'standards'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <BookOpen className="h-4 w-4" /> Gestión de Normas, Apartados e Ítems
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: CONTROL DE USUARIOS Y ROLES RBAC                   */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <CardTitle className="text-lg">Control de Acceso Basado en Roles (RBAC)</CardTitle>
                  <CardDescription>
                    Gestión de usuarios con contraseñas cifradas (RNF-03). Roles: Administrador, Evaluador y Consultor.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="default"
                  disabled={!isAdmin}
                  onClick={() => setShowUserForm(!showUserForm)}
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  {showUserForm ? 'Cancelar' : 'Registrar Usuario'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {showUserForm && isAdmin && (
                <form
                  onSubmit={handleCreateUser}
                  className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900 space-y-4"
                >
                  <h3 className="text-sm font-bold text-brand-900 dark:text-brand-200">
                    Nuevo Usuario con Contraseña Cifrada (Bcrypt)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="Ej. Ing. Diego Gamboa"
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Correo Institucional</label>
                      <input
                        type="email"
                        required
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="docente@espe.edu.ec"
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Contraseña</label>
                      <input
                        type="password"
                        required
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Rol RBAC</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                        className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-900"
                      >
                        <option value="ADMIN">ADMIN (Control Total)</option>
                        <option value="EVALUATOR">EVALUATOR (Califica Evaluaciones)</option>
                        <option value="CONSULTANT">CONSULTANT (Solo Lectura)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size="sm">
                      Guardar Usuario en Supabase
                    </Button>
                  </div>
                </form>
              )}

              <div className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {loading ? (
                  <p className="py-6 text-center text-gray-500">Cargando usuarios desde Supabase...</p>
                ) : (
                  users.map((u) => (
                    <div
                      key={u.id}
                      className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{u.name}</p>
                        <p className="text-xs text-gray-500 font-mono">{u.email}</p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <select
                          aria-label={`Cambiar rol de ${u.name}`}
                          disabled={!isAdmin}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="EVALUATOR">EVALUATOR</option>
                          <option value="CONSULTANT">CONSULTANT (Solo Lectura)</option>
                        </select>

                        <Badge
                          variant={
                            u.role === 'ADMIN'
                              ? 'default'
                              : u.role === 'EVALUATOR'
                              ? 'warning'
                              : 'secondary'
                          }
                        >
                          {u.role}
                        </Badge>

                        {isAdmin && u.email !== 'admin@espe.edu.ec' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Matriz de Permisos por Rol (Documentación visual RNF-03) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Matriz Oficial de Privilegios RBAC (RNF-03)</CardTitle>
              <CardDescription className="text-xs">
                Verifica qué acciones puede realizar cada perfil dentro de ISO-COMPASS.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 uppercase border-y">
                    <tr>
                      <th className="py-2.5 px-3">Rol ISO-COMPASS</th>
                      <th className="py-2.5 px-3">M1-M3. Biblioteca y Fichas</th>
                      <th className="py-2.5 px-3">M4. Evaluar Checklists y Evidencias</th>
                      <th className="py-2.5 px-3">M5-M6. Tablero y Reportes PDF/CSV</th>
                      <th className="py-2.5 px-3">M7. Administrar Normas y Usuarios</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr>
                      <td className="py-2.5 px-3 font-bold">ADMIN</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-semibold">Lectura y Edición</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-semibold">Habilitado</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-semibold">Habilitado</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-semibold">Control Total</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold">EVALUATOR</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-semibold">Lectura Completa</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-semibold">Habilitado (Califica C, P, NC, NA)</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-semibold">Habilitado</td>
                      <td className="py-2.5 px-3 text-gray-400">Restringido (Solo Lectura)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold">CONSULTANT</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-semibold">Solo Lectura</td>
                      <td className="py-2.5 px-3 text-gray-400">Solo Consulta (Sin modificar)</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-semibold">Consulta y Descarga</td>
                      <td className="py-2.5 px-3 text-gray-400">Restringido (Solo Lectura)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: FAMILIAS DE NORMAS (EXTENSIBILIDAD SECCIÓN 4.1)    */}
      {/* ========================================================= */}
      {activeTab === 'families' && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle className="text-lg">
                  Extensibilidad de Familias de Normas (Sección 4.1 de la Guía)
                </CardTitle>
                <CardDescription>
                  Permite incorporar nuevas familias como <strong>ISO 9001</strong> o <strong>ISO/IEC 25010</strong> desde administración sin modificar el código fuente.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!isAdmin}
                  onClick={() => handleQuickPresetFamily('ISO-9001')}
                  className="text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-500" /> + Plantilla ISO 9001
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!isAdmin}
                  onClick={() => handleQuickPresetFamily('ISO-25010')}
                  className="text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1 text-purple-500" /> + Plantilla ISO/IEC 25010
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  disabled={!isAdmin}
                  onClick={() => setShowFamilyForm(!showFamilyForm)}
                >
                  <Plus className="mr-1 h-4 w-4" /> Nueva Familia
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {showFamilyForm && isAdmin && (
              <form
                onSubmit={handleCreateFamily}
                className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-3"
              >
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  Registrar Nueva Familia de Normas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Código de Familia</label>
                    <input
                      type="text"
                      required
                      value={newFamilyCode}
                      onChange={(e) => setNewFamilyCode(e.target.value)}
                      placeholder="Ej. ISO-9001 o ISO-25010"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-900 font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold block mb-1">Nombre Oficial de la Familia</label>
                    <input
                      type="text"
                      required
                      value={newFamilyName}
                      onChange={(e) => setNewFamilyName(e.target.value)}
                      placeholder="Ej. Familia ISO/IEC 25010 — Calidad de Producto de Software"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Descripción y Alcance</label>
                  <textarea
                    rows={2}
                    required
                    value={newFamilyDesc}
                    onChange={(e) => setNewFamilyDesc(e.target.value)}
                    placeholder="Describe el propósito de esta familia de normas..."
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-900"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowFamilyForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    Guardar Familia en Base de Datos
                  </Button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {families.map((fam) => (
                <div
                  key={fam.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Badge variant="default" className="font-mono">
                        {fam.code}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{fam.standardsCount} normas vinculadas</Badge>
                        {isAdmin && fam.code !== 'ISO-29110' && (
                          <button
                            onClick={() => handleDeleteFamily(fam.id, fam.code)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Eliminar familia"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base">{fam.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {fam.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <span className="text-[11px] text-gray-400">Modelo Relacional Extensible</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => {
                        setStdFamilyCode(fam.code);
                        setActiveTab('standards');
                        if (isAdmin) setShowStandardForm(true);
                      }}
                    >
                      + Agregar Norma a {fam.code}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================= */}
      {/* TAB 3: GESTIÓN DE NORMAS, APARTADOS E ÍTEMS (RF-15)       */}
      {/* ========================================================= */}
      {activeTab === 'standards' && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle className="text-lg">
                  Administración de Normas, Apartados e Ítems (RF-15)
                </CardTitle>
                <CardDescription>
                  Registra nuevas normas o edita las 13 partes existentes de ISO/IEC 29110 con paráfrasis propia y enlaces verificados.
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="default"
                disabled={!isAdmin}
                onClick={() => setShowStandardForm(!showStandardForm)}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                {showStandardForm ? 'Cerrar Formulario' : 'Registrar / Editar Norma'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {showStandardForm && isAdmin && (
              <form
                onSubmit={handleUpsertStandard}
                className="p-5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4"
              >
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Ficha de Norma + Apartado e Ítem de Verificación
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Familia</label>
                    <select
                      value={stdFamilyCode}
                      onChange={(e) => setStdFamilyCode(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-950"
                    >
                      {families.map((f) => (
                        <option key={f.code} value={f.code}>
                          {f.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Código Norma</label>
                    <input
                      type="text"
                      required
                      value={stdCode}
                      onChange={(e) => setStdCode(e.target.value)}
                      placeholder="Ej. 25010-1 o 29110-1-1"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-950 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Título Resumido</label>
                    <input
                      type="text"
                      required
                      value={stdShortTitle}
                      onChange={(e) => setStdShortTitle(e.target.value)}
                      placeholder="Ej. Modelo de Calidad"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-950"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Edición Vigente</label>
                    <input
                      type="text"
                      required
                      value={stdEdition}
                      onChange={(e) => setStdEdition(e.target.value)}
                      placeholder="2024 / 2025"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Título Oficial Completo</label>
                    <input
                      type="text"
                      required
                      value={stdTitle}
                      onChange={(e) => setStdTitle(e.target.value)}
                      placeholder="Título descriptivo de la norma"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-950"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Categoría</label>
                    <select
                      value={stdCategory}
                      onChange={(e) => setStdCategory(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-950"
                    >
                      <option value="OVERVIEW">OVERVIEW (Visión general / Vocabulario)</option>
                      <option value="FRAMEWORK">FRAMEWORK (Marco y taxonomía)</option>
                      <option value="ASSESSMENT">ASSESSMENT (Evaluación y certificación)</option>
                      <option value="SPECIFICATIONS">SPECIFICATIONS (Especificaciones)</option>
                      <option value="GUIDELINES">GUIDELINES (Guías de gestión e ingeniería)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Tipo de Acceso (Copyright ISO)</label>
                    <select
                      value={stdAccessType}
                      onChange={(e) => setStdAccessType(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-950"
                    >
                      <option value="FREE">FREE (Acceso Libre / Público ISO)</option>
                      <option value="ISO_PAID">ISO_PAID (Catálogo Oficial de Pago ISO)</option>
                      <option value="INSTITUTIONAL">INSTITUTIONAL (Suscripción ESPE)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Audiencia Objetivo</label>
                    <input
                      type="text"
                      required
                      value={stdAudience}
                      onChange={(e) => setStdAudience(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-950"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Enlace Oficial ISO Verificado</label>
                    <input
                      type="url"
                      required
                      value={stdUrl}
                      onChange={(e) => setStdUrl(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Propósito General</label>
                  <input
                    type="text"
                    required
                    value={stdPurpose}
                    onChange={(e) => setStdPurpose(e.target.value)}
                    placeholder="Propósito normativo resumido..."
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Introducción (Paráfrasis Propia con Cita APA 7 — Control Anti-Plagio)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={stdIntro}
                    onChange={(e) => setStdIntro(e.target.value)}
                    placeholder="Redacta con tus propias palabras la síntesis de la norma y cita la fuente..."
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-950"
                  />
                </div>

                {/* Apartado e ítem inicial opcional */}
                <div className="p-3 rounded-lg bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 space-y-3">
                  <p className="text-xs font-bold text-brand-700 dark:text-brand-400">
                    Apartado e Ítem de Lista de Verificación (Opcional al crear/actualizar)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={secCode}
                      onChange={(e) => setSecCode(e.target.value)}
                      placeholder="Código apartado (ej. GP.1)"
                      className="px-2.5 py-1.5 text-xs rounded border border-gray-300 bg-transparent font-mono"
                    />
                    <input
                      type="text"
                      value={secName}
                      onChange={(e) => setSecName(e.target.value)}
                      placeholder="Nombre del apartado"
                      className="sm:col-span-2 px-2.5 py-1.5 text-xs rounded border border-gray-300 bg-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={itemCode}
                      onChange={(e) => setItemCode(e.target.value)}
                      placeholder="Código ítem (ej. GP.1.1)"
                      className="px-2.5 py-1.5 text-xs rounded border border-gray-300 bg-transparent font-mono"
                    />
                    <input
                      type="text"
                      value={itemStatement}
                      onChange={(e) => setItemStatement(e.target.value)}
                      placeholder="Enunciado verificable del ítem..."
                      className="sm:col-span-2 px-2.5 py-1.5 text-xs rounded border border-gray-300 bg-transparent"
                    />
                    <input
                      type="text"
                      value={itemDeliverable}
                      onChange={(e) => setItemDeliverable(e.target.value)}
                      placeholder="Evidencia esperada"
                      className="px-2.5 py-1.5 text-xs rounded border border-gray-300 bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowStandardForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" size="sm">
                    Guardar Norma en Catálogo
                  </Button>
                </div>
              </form>
            )}

            {/* Tabla de Normas Registradas */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 uppercase border-y">
                  <tr>
                    <th className="py-3 px-3">Familia</th>
                    <th className="py-3 px-3">Código</th>
                    <th className="py-3 px-3">Título Resumido</th>
                    <th className="py-3 px-3">Edición</th>
                    <th className="py-3 px-3">Acceso</th>
                    <th className="py-3 px-3">Ítems</th>
                    <th className="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {standards.map((std) => (
                    <tr key={std.code} className="hover:bg-gray-50/70 dark:hover:bg-gray-900/40">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-gray-500">
                        {std.familyCode || 'ISO-29110'}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-brand-600">{std.code}</td>
                      <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-gray-100">
                        {std.shortTitle}
                      </td>
                      <td className="py-2.5 px-3">{std.edition}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant={std.accessType === 'FREE' ? 'success' : 'secondary'}>
                          {std.accessType}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{std.itemsCount} ítems</td>
                      <td className="py-2.5 px-3 text-right space-x-1">
                        <Link href={`/normas/${std.code}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                            Ver Ficha <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-2"
                            onClick={() => handleEditStandardLoad(std)}
                          >
                            Editar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
