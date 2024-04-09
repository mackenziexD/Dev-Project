import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SidebarLink = ({ href, icon, children }: { href: string, icon: any, children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    const baseClass = "flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900";
    const activeClass = "bg-gray-100 text-slate-700 dark:bg-gray-900 dark:text-white";
    const inactiveClass = "text-slate-700 dark:text-slate-400 dark:hover:text-slate-300";

    return (
        <li>
        <Link href={href} className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}>
            <FontAwesomeIcon icon={icon} className='flex-shrink-0' style={{width: "1rem", height: "1rem"}} />
            {children}
        </Link>
        </li>
    );
};

export default SidebarLink;
