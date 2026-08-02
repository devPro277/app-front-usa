export default function TeacherCard({ teacher, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div>
          {/* Ism familiya — Och va yaqqol ko'rinadigan rang */}
          <h3 className="text-base font-semibold text-[#1B365D] dark:text-white">
            {teacher.name}
          </h3>
          
          {/* Yo'nalish badge */}
          <span className="mt-1.5 inline-block rounded-lg bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-600 border border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400">
            {teacher.subject || teacher.direction || "Yo'nalish ko'rsatilmagan"}
          </span>
        </div>

        {/* Action tugmalari */}
        <div className="flex gap-1">
          <IconButton onClick={() => onEdit(teacher)} label="Tahrirlash">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(teacher)} label="O'chirish" danger>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      {/* Login va Guruhlar soni */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-slate-700/60 dark:text-slate-300">
        <span>
          Login: <strong className="font-medium text-gray-700 dark:text-slate-200">{teacher.login || teacher.username}</strong>
        </span>
        <span className="font-mono font-semibold text-[#1B365D] dark:text-orange-400">
          {teacher.groupsCount || 0} ta guruh
        </span>
      </div>
    </div>
  );
}

function IconButton({ children, onClick, label, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
        danger
          ? 'text-gray-400 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/50 dark:hover:text-red-400'
          : 'text-gray-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13.5 6.5 17.5 10.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}