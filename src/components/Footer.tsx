const Footer = () => {
    return (
        <footer className="flex justify-center w-screen items-center p-4 space-x-5 bg-gray-800 text-white py-4 text-center fixed bottom-0 left-0">
                <div>
                    <a href="/about" className="mr-4">About</a>
                    <a href="/contact">Contact</a>
                </div>
                <div>
                    &copy; {new Date().getFullYear()} Voice of Consumer
                </div>
        </footer>
    );
};

export default Footer;
