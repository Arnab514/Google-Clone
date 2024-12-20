

const Footer: React.FC = () => {
    return (
        <footer className="absolute bottom-0 h-24 w-full bg-[#171717]">
            <p className="py-3 px-8 text-sm text-white ">India</p>
            <hr className="border-gray-700" />
            <div className="flex py-3 px-8">
                <ul className="flex [&>*]:mr-7 text-sm text-white ">
                    {/* <li className="cursor-pointer hover:text-white">About</li> */}
                    <li className="cursor-pointer hover:text-white">Advertising</li>
                    <li className="cursor-pointer hover:text-white">Business</li>
                    <li className="cursor-pointer hover:text-white">How Search works</li>
                </ul>
                <ul className="flex ml-auto [&>*]:ml-6 text-sm text-white">
                    <li className="cursor-pointer hover:text-white">Privacy</li>
                    <li className="cursor-pointer hover:text-white">Terms</li>
                    <li className="cursor-pointer hover:text-white">Settings</li>
                </ul>
            </div>
        </footer>
    )       
}

export default Footer;