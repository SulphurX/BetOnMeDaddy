import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { GetStartedButton } from "@/components/GetStartedButton";
import { useSession } from "next-auth/react";
import { useOkto } from "okto-sdk-react";
import { OktoContextType } from "okto-sdk-react";

export function Navbar() {
  const { data: session } = useSession();
  const { isLoggedIn, showWidgetModal } = useOkto() as OktoContextType;

  console.log(isLoggedIn);
  // if isLoggenIn set 

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
      <div className="flex items-center gap-8">
        <a href="/">
          <div className="flex items-center gap-2">
            {/* <Image 
              src="/placeholder.svg"
              alt="Sulphur Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            /> */}
            <span className="text-xl font-semibold">BetOnMeDaddy</span>
          </div>
        </a>
        
        <div className="hidden md:flex relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search markets" 
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 w-full"
          />
        </div>
      </div>

      {isLoggedIn && (
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => showWidgetModal()}
        >
          Add Funds  
      </Button>
      )}

      <div className="flex items-center gap-4">
        <GetStartedButton />
      </div>
    </nav>
  )
}

