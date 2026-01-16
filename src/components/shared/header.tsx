import { navItems } from '@/constants/data';
import { usePathname } from '@/routes/hooks';
import Heading from './heading';
// import UserNav from './user-nav';
import ThemeToggle from './theme-toggle';
import DataSourceSelector from './data-source-selector';

// Custom hook to find the matched path
const useMatchedPath = (pathname: string) => {
  const matchedPath =
    navItems.find((item) => item.href === pathname) ||
    navItems.find(
      (item) => pathname.startsWith(item.href + '/') && item.href !== '/'
    );
  return matchedPath?.title || '';
};

export default function Header() {
  const pathname = usePathname();
  const headingText = useMatchedPath(pathname);

  return (
    <div className="flex flex-1 items-center justify-between bg-secondary px-4">
      <Heading title={headingText} />
      <div className="ml-4 flex items-center gap-3 md:ml-6">
        <div className="border border-red-500">
          <DataSourceSelector />
        </div>
        {/* <UserNav /> */}
        <ThemeToggle />
      </div>
    </div>
  );
}
