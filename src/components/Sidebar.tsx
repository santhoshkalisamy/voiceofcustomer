import {Button, Card, Checkbox, Input, Textarea, Typography,} from "@material-tailwind/react";
import {MagnifyingGlassIcon,} from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";
import {PopularTags} from "../services/PostService.ts";
import {PopularTag} from "../models/PopularTag.ts";
import {useNavigate} from "react-router-dom";

export function Sidebar() {

    const navigate = useNavigate();

    const [formValues, setFormValues] = useState<{
        search: string,
        categories: string[],
        tags: string[]
    }>({
        search: "",
        categories: [],
        tags: []
    });

    const [popularTags, setPopularTags] = useState<PopularTag[]>([]);
    const [userTags, setUserTags] = useState<string[]>([]);
    useEffect(() => {
        PopularTags().then((response) => {
            setPopularTags(response.data);
        }).catch((error) => {
            console.log(error);
        });
    },[]);

    function handleSearchBox(event: React.ChangeEvent<HTMLInputElement>) {
        console.log(event.target.value);
        setFormValues({...formValues, search: event.target.value});
    }

    function handleCategorySelection(event: React.ChangeEvent<HTMLInputElement>) {
        console.log(event.target.checked);
        console.log(event.target.value);
        const categoriesSelected = formValues.categories;
        if (!event.target.checked) {
            const index = categoriesSelected.indexOf(event.target.value);
            categoriesSelected.splice(index, 1);
            setFormValues({...formValues, categories: categoriesSelected});
        } else {
            setFormValues({...formValues, categories: [...categoriesSelected, event.target.value]});
        }
    }
    function handleTagsSelection(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setFormValues({...formValues, tags: event.target.value.split(",")});
    }

    function handleSubmit() {
        console.log(formValues);
        navigate(`/post/all?search=${formValues.search}&categories=${formValues.categories.join(",")}&tags=${formValues.tags.join(",")}`);
    }

    return (
        <aside className="fixed overflow-scroll top-0 right-0 mt-32 bg-gray-200 w-1/6 mr-20 flex-shrink-0 h-4/5">
            <Card onPointerEnterCapture={""} onPointerLeaveCapture={""} placeholder={""}
                  className="w-full p-4 shadow-xl shadow-blue-gray-900/5 bg-gray-100">
                <div className="mb-2 flex items-center justify-between gap-4 p-4">
                    <Typography onPointerEnterCapture={""} onPointerLeaveCapture={""} placeholder={""} variant="h5"
                                color="blue-gray">
                        Filters
                    </Typography>
                    <Button placeholder onPointerEnterCapture onPointerLeaveCapture color="green" ripple={true} onClick={handleSubmit}>Apply</Button>
                </div>
                <div className="p-2">
                    <Input onChange={handleSearchBox} icon={<MagnifyingGlassIcon className="h-5 w-5"/>} label="Search"
                           onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}/>
                    <div className="mt-3 flex gap-4 p-4 flex-col">
                        <Typography onPointerEnterCapture={""} onPointerLeaveCapture={""} placeholder={""} variant="h5"
                                    color="blue-gray">
                            Categories
                        </Typography>
                        <div className="flex flex-col gap-2">
                            <Checkbox onChange={handleCategorySelection} value="FEEDBACK" label="Feedback" className="inline" onPointerEnterCapture onPointerLeaveCapture crossOrigin color="green"  />
                            <Checkbox onChange={handleCategorySelection} value="COMPLAINT" label="Complaint" onPointerEnterCapture onPointerLeaveCapture crossOrigin color="green"  />
                            <Checkbox onChange={handleCategorySelection} value="REVIEW" label="Review" onPointerEnterCapture onPointerLeaveCapture crossOrigin color="green"  />
                            <Checkbox onChange={handleCategorySelection} value="MISC" label="Misc" onPointerEnterCapture onPointerLeaveCapture crossOrigin color="green"  />
                        </div>
                    </div>
                    <div className="mt-3 flex gap-4 p-4 flex-col">
                        <Typography onPointerEnterCapture={""} onPointerLeaveCapture={""} placeholder={""} variant="h5"
                                    color="blue-gray">
                            Tags
                        </Typography>
                        <div className="flex flex-col gap-2">
                            <Textarea onChange={handleTagsSelection} variant="outlined" onPointerEnterCapture onPointerLeaveCapture color="green" label="add comma seperated tags" />
                            <ul>
                                {popularTags.map((tag, index) => (
                                    <li key={index} onClick={() => setUserTags([...userTags, tag.tag])} className="text-gray-600 px-4 py-2 hover:bg-gray-100">{tag.tag} ({ tag.count})</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Card>
        </aside>
    );
}
