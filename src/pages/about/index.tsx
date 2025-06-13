import { useRouter } from '@/routes/hooks';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        More Info soon!
      </span>
      <h2 className="font-heading my-2 text-2xl font-bold">
        This a platform being developped by GRAVITAS sarl to help small, medium
        and big businesses based in Goma to make more informed decisions.
      </h2>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => router.back()} variant="default" size="lg">
          Go back
        </Button>
        <Button onClick={() => router.push('/')} variant="ghost" size="lg">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
