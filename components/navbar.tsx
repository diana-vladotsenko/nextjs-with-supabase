import Link from "next/link";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex items-center gap-3">
            <Button asChild size="sm" variant="outline">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/notes">Notes</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/todos">To-do</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/recipes">Recipes</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/form">Form</Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </div>
      </nav>
    </>
  );
}
