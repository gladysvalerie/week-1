export default function Header() {
    
    return (
        <div className="relative flex items-center justify-end p-2 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => {
                    console.log("button 1 clicked")
                }}
            >
                Button 1
            </button>
        </div>
    )
}