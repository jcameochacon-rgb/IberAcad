"use client";
import { useActionState, useState } from "react";
import { LoaderCircle, UserPlus, Save, UserX, UserCheck } from "lucide-react";
import { roles, roleLabels, type Role } from "@iberdrola/shared";
import {
  createUser,
  updateUser,
  setUserActive,
} from "@/app/panel/usuarios/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UserFormState } from "@/lib/user-validation";
import type { UserRow, UnlinkedPerson } from "@/lib/data/users";

const selectClass =
  "h-12 w-full rounded-lg border border-input bg-background px-3 text-sm";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  maxLength,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={`u-${name}`} className="mb-2 block text-sm font-medium">
        {label}
        {required ? " *" : ""}
      </label>
      <Input
        id={`u-${name}`}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        maxLength={maxLength}
        autoComplete="off"
      />
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Feedback({ state }: { state: UserFormState }) {
  return (
    <>
      {state.error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}
      {state.success && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {state.success}
        </p>
      )}
    </>
  );
}

function Fields({
  v,
  emailHint,
  allowed = roles,
}: {
  v: Partial<UserRow>;
  emailHint?: string;
  allowed?: readonly Role[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label="Nombres"
        name="nombres"
        defaultValue={v.nombres}
        required
        maxLength={120}
      />
      <Field
        label="Apellido paterno"
        name="apellido_paterno"
        defaultValue={v.apellido_paterno}
        maxLength={120}
      />
      <Field
        label="Apellido materno"
        name="apellido_materno"
        defaultValue={v.apellido_materno}
        maxLength={120}
      />
      <Field label="CI" name="ci" defaultValue={v.ci} maxLength={40} />
      <Field
        label="Correo electrónico"
        name="email"
        type="email"
        defaultValue={v.email}
        required
        maxLength={254}
        hint={emailHint}
      />
      <Field
        label="Teléfono"
        name="telefono"
        defaultValue={v.telefono}
        maxLength={40}
      />
      <div>
        <label htmlFor="u-rol" className="mb-2 block text-sm font-medium">
          Rol *
        </label>
        <select
          id="u-rol"
          name="rol"
          required
          defaultValue={v.rol ?? ""}
          className={selectClass}
        >
          <option value="">Selecciona un rol</option>
          {allowed.map((r) => (
            <option key={r} value={r}>
              {roleLabels[r]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="u-direccion" className="mb-2 block text-sm font-medium">
          Dirección
        </label>
        <Input
          id="u-direccion"
          name="direccion"
          defaultValue={v.direccion}
          maxLength={500}
        />
      </div>
    </div>
  );
}

export function CreateUserForm({
  keyReady,
  keyStatus = "missing",
  people = [],
  allowed = roles,
  initialPerson = "",
}: {
  keyReady: boolean;
  keyStatus?: "ok" | "missing" | "invalid";
  people?: UnlinkedPerson[];
  allowed?: readonly Role[];
  /** Ficha preseleccionada (botón «Crear acceso» de las listas de cuentas). */
  initialPerson?: string;
}) {
  const [state, action, pending] = useActionState(
    createUser,
    {} as UserFormState,
  );
  const v = (state.values ?? {}) as Partial<UserRow> & {
    modo?: string;
    persona_id?: string;
  };
  const preset = people.some((p) => p.id === initialPerson)
    ? initialPerson
    : "";
  const [mode, setMode] = useState(
    v.modo === "existente" || (!v.modo && preset) ? "existente" : "nueva",
  );
  const [personId, setPersonId] = useState(v.persona_id ?? preset);
  const person = people.find((p) => p.id === personId);
  return (
    <form
      key={state.success ? `ok-${state.attempt}` : "form"}
      action={action}
      className="space-y-5"
    >
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Datos personales</legend>
        <div className="flex flex-wrap gap-2">
          {[
            ["nueva", "Persona nueva"],
            ["existente", "Vincular a una ficha existente"],
          ].map(([value, label]) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${
                mode === value
                  ? "border-primary bg-primary/5 font-semibold text-primary"
                  : "border-input"
              }`}
            >
              <input
                type="radio"
                name="modo"
                value={value}
                checked={mode === value}
                onChange={() => setMode(value)}
                className="accent-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      {mode === "existente" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="u-persona"
              className="mb-2 block text-sm font-medium"
            >
              Ficha registrada sin cuenta *
            </label>
            <select
              id="u-persona"
              name="persona_id"
              required
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              className={selectClass}
            >
              <option value="">
                {people.length
                  ? "Selecciona estudiante, docente o tutor"
                  : "No hay fichas sin cuenta"}
              </option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} — {p.kinds.map((k) => roleLabels[k]).join(", ")}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Se usan los datos de la ficha. No se crea otra persona.
            </p>
          </div>
          <Field
            label="Correo electrónico"
            name="email"
            type="email"
            defaultValue={v.email}
            required
            maxLength={254}
            hint="Recibirá el enlace de verificación para crear su contraseña."
          />
          <div>
            <label htmlFor="u-rol-x" className="mb-2 block text-sm font-medium">
              Rol *
            </label>
            <select
              id="u-rol-x"
              name="rol"
              required
              key={personId}
              defaultValue={person?.kinds[0] ?? v.rol ?? ""}
              className={selectClass}
            >
              <option value="">Selecciona un rol</option>
              {(person ? person.kinds : allowed)
                .filter((r) => allowed.includes(r))
                .map((r) => (
                  <option key={r} value={r}>
                    {roleLabels[r]}
                  </option>
                ))}
            </select>
          </div>
        </div>
      ) : (
        <Fields
          v={state.success ? {} : v}
          emailHint="Recibirá una invitación para crear su propia contraseña."
          allowed={allowed}
        />
      )}
      <Feedback state={state} />
      {!keyReady && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {keyStatus === "invalid" ? (
            <>
              La variable <code>SUPABASE_SERVICE_ROLE_KEY</code> llegó al
              servidor, pero su valor no es una clave secreta válida. Debe
              empezar con <code>sb_secret_</code> (no{" "}
              <code>sb_publishable_</code>).
            </>
          ) : keyStatus === "ok" ? (
            <>
              La clave secreta es válida, pero falta configurar{" "}
              <code>NEXT_PUBLIC_SUPABASE_URL</code> o la clave pública.
            </>
          ) : (
            <>
              El servidor no recibe <code>SUPABASE_SERVICE_ROLE_KEY</code>.
              Revisa que la variable exista en este entorno (Production) y
              vuelve a desplegar.
            </>
          )}
        </p>
      )}
      <Button disabled={pending || !keyReady}>
        {pending ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : (
          <UserPlus size={16} />
        )}
        Crear usuario
      </Button>
    </form>
  );
}

export function EditUserForm({
  user,
  emailsAvailable,
  allowed = roles,
}: {
  user: UserRow;
  emailsAvailable: boolean;
  allowed?: readonly Role[];
}) {
  const [state, action, pending] = useActionState(
    updateUser,
    {} as UserFormState,
  );
  const v = state.values ? ({ ...user, ...state.values } as UserRow) : user;
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={user.id} />
      <input type="hidden" name="version" value={user.version} />
      <Fields
        v={v}
        allowed={allowed}
        emailHint={
          emailsAvailable
            ? "Si cambias el correo, el usuario deberá entrar con el nuevo."
            : "Sin clave de servicio el correo no se puede consultar ni cambiar."
        }
      />
      <Feedback state={state} />
      <Button disabled={pending}>
        {pending ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : (
          <Save size={16} />
        )}
        Guardar cambios
      </Button>
    </form>
  );
}

export function ActiveToggle({
  user,
  self,
  compact = false,
}: {
  user: UserRow;
  self: boolean;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState(
    setUserActive,
    {} as UserFormState,
  );
  const next = !user.activo;
  return (
    <form action={action} className="inline-flex flex-col items-start gap-1">
      <input type="hidden" name="id" value={user.id} />
      <input type="hidden" name="activo" value={String(next)} />
      <Button
        size={compact ? "sm" : "default"}
        variant={next ? "secondary" : "outline"}
        disabled={pending || (self && !next)}
        className={next ? "" : "border-red-200 text-red-700 hover:bg-red-50"}
        title={
          self && !next ? "No puedes desactivar tu propia cuenta" : undefined
        }
        onClick={(e) => {
          if (
            !next &&
            !window.confirm(
              `¿Desactivar a ${user.fullName}? No podrá iniciar sesión hasta que lo reactives.`,
            )
          )
            e.preventDefault();
        }}
      >
        {pending ? (
          <LoaderCircle size={15} className="animate-spin" />
        ) : next ? (
          <UserCheck size={15} />
        ) : (
          <UserX size={15} />
        )}
        {next ? "Reactivar" : "Desactivar"}
      </Button>
      {state.error && (
        <span role="alert" className="max-w-[220px] text-xs text-red-700">
          {state.error}
        </span>
      )}
    </form>
  );
}
