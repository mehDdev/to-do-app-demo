import { Moon, Sun } from "lucide-react";


function ThemeToggle() {
    const toggleTheme = () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
  };

    return (
        <button type="button"className="flex justify-center items-center size-9.5 bg-custom-purple hover:bg-custom-purple-2 hover:shadow-normal transition-all rounded-md cursor-pointer transition-all" onClick={toggleTheme}>
            <Moon className="dark:hidden text-white" />
            <Sun className="hidden dark:inline-block text-white" />
        </button>
    )
};

export default ThemeToggle;