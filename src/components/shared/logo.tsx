type LogoProps = {
  isMinimized?: boolean;
};

export default function Logo({ isMinimized = false }: LogoProps) {
  return (
    //   <img
    //     src="public/gravitas_logo_website.svg"
    //     alt="App Logo"
    //     className={isMinimized ? 'w-10 h-10' : 'max-w-[160px] h-auto'}
    //   />

    <div
      className={`flex items-center justify-center p-2  ${
        isMinimized ? 'h-14 w-14' : 'h-[60px] w-[180px]'
      } bg-[radial-gradient(circle_80px_20px_at_center,_#6366f1,_#1e293b)]`}
    >
      <img
        src="/gravitas_logo_website.svg"
        alt="App Logo"
        className={isMinimized ? 'h-10 w-10' : 'h-auto max-w-[140px]'}
      />
    </div>
  );
}
