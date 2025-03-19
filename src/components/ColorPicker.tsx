import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from 'lucide-react'
import { cn } from "@/lib/utils"

const colors = [
  "bg-zinc-200",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-gray-500",
]

interface ColorPickerProps {
  selectedColor: string
  onColorChange: (color: string) => void
}

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[120px] justify-between",
            selectedColor.replace("bg-", "text-").replace("500", "900")
          )}
        >
          Color
          <div className={cn("h-4 w-4 rounded-full", selectedColor)} />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[120px] p-0">
        <div className="grid grid-cols-3 gap-1 p-1">
          {colors.map((color) => (
            <Button
              key={color}
              variant="outline"
              className={cn("h-8 w-8 p-0", color)}
              onClick={() => onColorChange(color)}
            >
              {selectedColor === color && (
                <Check className={cn("h-4 w-4", color.replace("bg-", "text-").replace("500", "50"))} />
              )}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

