import {Card, Input, Typography,} from "@material-tailwind/react";
import {MagnifyingGlassIcon,} from "@heroicons/react/24/outline";

export function Sidebar() {
    return (
        <aside className="fixed top-0 right-0 mt-32 bg-gray-200 w-1/6 mr-20 flex-shrink-0 h-4/5">
            <Card onPointerEnterCapture={""} onPointerLeaveCapture={""} placeholder={""}
                  className="h-full w-full p-4 shadow-xl shadow-blue-gray-900/5 bg-gray-100">
                <div className="mb-2 flex items-center gap-4 p-4">
                    <Typography onPointerEnterCapture={""} onPointerLeaveCapture={""} placeholder={""} variant="h5"
                                color="blue-gray">
                        Filters
                    </Typography>
                </div>
                <div className="p-2">
                    <Input icon={<MagnifyingGlassIcon className="h-5 w-5"/>} label="Search"
                           onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}/>
                </div>
            </Card>
        </aside>
    );
}
