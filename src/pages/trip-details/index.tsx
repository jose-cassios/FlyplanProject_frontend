import { Plus, UserCog } from "lucide-react";
import { useState } from "react";
import { CreateActivityModal } from "./create-activity-modal"
import { CreateLinkModal } from "./create-links-modal"
import { ImportantLinks } from "./important-links";
import { Guests } from "./guests";
import { Activities } from "./activities";
import { DestinationAndDateHeader } from "./destination-and-date-header";
import { Button } from "../../components/button";
import { InviteGuestsModal } from "../create-trip/invite-guests-modal";
import { api } from "../../lib/axios";
import { useNavigate, useParams } from "react-router-dom";

export function TripDetailsPage() {
    const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false)
    const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false)
    const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)

    function openCreateActivityModalOpen(){
        setIsCreateActivityModalOpen(true)
    }
    function closeCreateActivityModalOpen(){
        setIsCreateActivityModalOpen(false)
    }

    function openCreateLinkModalOpen() {
        setIsCreateLinkModalOpen(true)
    }
    function closeCreateLinkModalOpen() {
        setIsCreateLinkModalOpen(false)
    }

    function openGuestsModal(){
        setIsGuestsModalOpen(true)
    }
    function closeGuestsModal(){
        setIsGuestsModalOpen(false)
    }

    const { tripId } = useParams()
    const navigate = useNavigate()
    return (
         <div className="max-w-6xl px-6 py-10 mx-auto space-y-8">
            <DestinationAndDateHeader />

            <main className="flex gap-16 px-4">
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-semibold">Atividades</h2>
                        <Button onClick={openCreateActivityModalOpen} type="submit" variant="primary" size="default">
                            <Plus className="size-5"/>
                            Cadastrar atividade
                        </Button>
                    </div>
                    <Activities />
                </div>

                <div className="w-80 space-y-6">
                    <ImportantLinks />
                    <Button onClick={openCreateLinkModalOpen} variant="secondary">
                        Cadastrar novo link
                        <Plus className="size-5" />
                    </Button>
                    <div className="w-full h-px bg-zinc-800" />
                    <Guests />
                    <Button onClick={openGuestsModal} variant="secondary">
                        <UserCog className="size-5" />
                        Gerenciar convidados
                    </Button>
                </div>
            </main>

            {isCreateActivityModalOpen && (
                <CreateActivityModal
                    closeCreateActivityModalOpen={closeCreateActivityModalOpen}
                />
            )}
            {isCreateLinkModalOpen && (
                <CreateLinkModal
                    closeCreateLinksModalOpen={closeCreateLinkModalOpen}
                />
            )}
            {isGuestsModalOpen && (
                <InviteGuestsModal
                    closeGuestModal={closeGuestsModal}
                    onAddEmail={async (email) => {
                        await api.post(`/trips/${tripId}/invites`, { email }).then(()=>{
                            closeGuestsModal()
                            navigate(`/trips/${tripId}`)
                        })
                    }}
                />
            )}

         </div>
    )
}