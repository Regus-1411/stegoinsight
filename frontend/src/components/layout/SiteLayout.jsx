import SiteNavbar from "./SiteNavbar";
import SiteFooter from "./SiteFooter";

const SiteLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteNavbar />
            <main className="flex-1 pt-16">
                {children}
            </main>
            <SiteFooter />
        </div>
    );
};

export default SiteLayout;
