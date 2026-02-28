import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { InviteGuestsModal } from "./invite-guests-modal"
import { ConfirmTripModal } from "./confirm-trip-modal"
import { DestinationAndDateStep } from "./steps/destination-and-date-step"
import { InviteGuestsStep } from "./steps/invite-guests-step"
import { DateRange } from "react-day-picker"
import { api } from "../../lib/axios"

export function CreateTripPage() {
  const navigate = useNavigate()

  // GuestsInput é o campo de Quem estará na viagem
  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false)
  function openGuestsInput() {
    setIsGuestsInputOpen(true)
  }
  function closeGuestsInput(){
    setIsGuestsInputOpen(false)
  }

  // Modal para inserir os emails dos convidados
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
  function openGuestsModal(){
    setIsGuestsModalOpen(true)
  }
  function closeGuestModal(){
    setIsGuestsModalOpen(false)
  }

  // Modal para confirmar a viagem
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function openConfirmTripModal(){
    setIsConfirmTripModalOpen(true)
  }
  function closeConfirmTripModal(){
    setIsConfirmTripModalOpen(false)
  }

  const [destination, setDestination] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()

  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])
  
  function removeEmailFromInvites(emailToRemove: string){
    const newEmailList = emailsToInvite.filter(invited => invited !== emailToRemove)
    setEmailsToInvite(newEmailList)
  }
  
  async function createTrip(event: FormEvent<HTMLFormElement>){
    event.preventDefault()
    
    if (!destination || !ownerEmail || !ownerName || !eventStartAndEndDates?.from || !eventStartAndEndDates?.to){
      alert('Preencha todos os dados para criar a viagem')
      return
    }

  try {
    setIsLoading(true)

    const response = await api.post('/trips', {
      destination,
      starts_at: eventStartAndEndDates?.from,
      ends_at: eventStartAndEndDates?.to,
      owner_name: ownerName,
      owner_email: ownerEmail,
      emails_to_invite: emailsToInvite
    })

    const { tripId } = response.data

    navigate(`/trips/${tripId}`)
    } catch (error) {
      alert(`Erro ao criar viagem ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.png" alt="FlyPlan" />
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

          <div className="space-y-4">
            <DestinationAndDateStep 
                closeGuestsInput={closeGuestsInput}
                isGuestsInputOpen={isGuestsInputOpen}
                openGuestsInput={openGuestsInput}
                setDestination={setDestination}
                setEventStartAndEndDates={setEventStartAndEndDates}
                eventStartAndEndDates={eventStartAndEndDates}
            />
          
            {isGuestsInputOpen && (
              <InviteGuestsStep 
                emailsToInvite={emailsToInvite}
                openConfirmTripModal={openConfirmTripModal}
                openGuestsModal={openGuestsModal}
              />
            )}
        </div>

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela plann.er você automaticamente concorda <br/>
          com nossos <a href="#" className="text-zinc-300 underline">termos de uso</a> e <a href="#" className="text-zinc-300 underline">políticas de privacidade</a>.
        </p>
      </div>

        {isGuestsModalOpen && (
          <InviteGuestsModal 
              emailsToInvite={emailsToInvite}
              onAddEmail={(email) => {
                if (!emailsToInvite.includes(email)) {
                  setEmailsToInvite(prev => [...prev, email])
                }
              }}
              closeGuestModal={closeGuestModal}
              onRemoveEmail={removeEmailFromInvites}
          />
        )}

        {isConfirmTripModalOpen && (
        <ConfirmTripModal 
            closeConfirmTripModal={closeConfirmTripModal}
            createTrip={createTrip}
            setOwnerName={setOwnerName}
            setOwnerEmail={setOwnerEmail}
            isLoading={isLoading}
            trip = {{
              destination,
              eventStartAndEndDates
            }}
        />
        )}
    </div>
  )
}
