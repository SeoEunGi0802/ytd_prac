"use client"

import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {useState} from "react";
import {Label} from "@/components/ui/label"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import api from "axios";
/*
https://youtu.be/nbqguu8NsM4?si=RpqL3pN-bDPJ1ix6
https://youtu.be/nbqguu8NsM4
*/

export default function Home() {
    const [validUrl, setValidUrl] = useState(false);
    const [youtubeTitle, setYoutubeTitle] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [checkType, setCheckType] = useState("mp4");

    const convertCopyUrl = async (copyUrl) => {
        try {
            const urlObj = new URL(copyUrl);

            const title = await api.get(`https://noembed.com/embed?url=${urlObj.href}`).then(res => {
                if (res.data.error) {
                    setYoutubeUrl("");
                    setValidUrl(false);
                }

                return res.data.title;
            });

            const pathname = urlObj.pathname;
            const url = `https://www.youtube.com/embed${pathname}`;

            setYoutubeTitle(title);
            setYoutubeUrl(url);
            setValidUrl(true);
        } catch (err) {
            setYoutubeTitle("");
            setYoutubeUrl("");
            setValidUrl(false);
        }
    }

    const download = async () => {
        const res = await api.get(`/download?url=${youtubeUrl}&format=${checkType}&title=${youtubeTitle}`, {
            responseType: "blob"
        })
        .then(res => {
            const name = res.headers["content-disposition"].split("filename=")[1].replace(/"/g, "");
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", name);
            link.style.cssText = "display:none";
            document.body.appendChild(link);
            link.click();
            link.remove();
        })

        console.log("res", res);
    }

    return (
        <div className=" h-screen w-full items-center justify-center">
            <main className="flex-grow container mx-auto py-4">
                <div className="flex flex-1 flex-col gap-4 mb-5">
                    {youtubeUrl ?
                        <>
                            <embed className="aspect-video rounded-xl bg-muted/50" style={{height: "575px"}} src={youtubeUrl}/>
                            <div>{youtubeTitle}</div>
                        </>
                        :
                        <div className="aspect-video rounded-xl bg-muted/50" style={{height: "575px"}}/>
                    }
                </div>

                <section className={"flex flex-col items-start gap-4"}>
                    <Input id={"youtubeUrl"} type={"url"} placeholder={"Youtube URL 입력"} onKeyUp={(e) => convertCopyUrl(e.target.value)}/>

                    {validUrl ?
                        <>
                            <RadioGroup defaultValue="mp4" onValueChange={setCheckType}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="mp4" id="video" checked={checkType === "mp4"}/>
                                    <Label htmlFor="video">영상</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="mp3" id="audio" checked={checkType === "mp3"}/>
                                    <Label htmlFor="audio">음원</Label>
                                </div>
                            </RadioGroup>
                            <Button variant="outline" onClick={download}>다운로드</Button>
                        </>
                        :
                        ""
                    }
                </section>
            </main>
        </div>
    );
}
