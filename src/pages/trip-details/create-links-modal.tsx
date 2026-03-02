import { Bookmark, LinkIcon, X } from "lucide-react"
import { Button } from "../../components/button"
import { FormEvent } from "react"
import { api } from "../../lib/axios"
import { useParams } from "react-router-dom"

interface CreateLinksModalProps {
    closeCreateLinksModalOpen: () => void
}

export function CreateLinkModal ({
    closeCreateLinksModalOpen
}: CreateLinksModalProps) {
    const { tripId } = useParams()

    async function createLink(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const data = new FormData(event.currentTarget)
        const title = data.get('title')?.toString()
        const url = data.get('url')?.toString()

        try {
            await api.post(`trips/${tripId}/links`, {
                title,
                url
            }).then(() => {
                closeCreateLinksModalOpen()
                window.document.location.reload()
            })
        } catch (error){
            console.error("Erro ao criar link: ", error)
            alert("Não foi possível salvar o link. Tente novamente.")
        }
    }


    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Confirmar link</h2>
                        <button onClick={closeCreateLinksModalOpen} type="button"><X className="size-5 text-zinc-400" /></button>
                    </div>
                </div>
            
                <form onSubmit={createLink} className="space-y-3">
                    <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                        <Bookmark className="text-zinc-400 size-5" />
                        <input 
                            type="text"
                            name="title" 
                            placeholder="Qual o título do link?"
                            className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                            <LinkIcon className="text-zinc-400 size-5" />
                            <input 
                                type="url"
                                name="url"
                                placeholder="URL do link" 
                                className="bg-transparent [color-scheme:dark] text-lg placeholder-zinc-400 outline-none flex-1"/>
                        </div>
                    </div>

                    <Button variant="primary" size="full">
                        Salvar link
                    </Button>
                    
                </form>
            </div>
        </div>
    )
}