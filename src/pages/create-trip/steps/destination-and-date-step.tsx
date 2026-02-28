import { ArrowRight, Calendar, MapPin, Settings2, X } from "lucide-react";
import { Button } from "../../../components/button";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DestinationAndDateStepProps {
    isGuestsInputOpen: boolean
    closeGuestsInput: () => void
    openGuestsInput: () => void
    setDestination: (destination: string) => void
    setEventStartAndEndDates: (dates: DateRange | undefined) => void
    eventStartAndEndDates: DateRange | undefined
}


export function DestinationAndDateStep({
    closeGuestsInput,
    isGuestsInputOpen,
    openGuestsInput,
    setEventStartAndEndDates,
    eventStartAndEndDates,
    setDestination
}: DestinationAndDateStepProps) {

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(eventStartAndEndDates)
    const [dateError, setDateError] = useState<string | null>(null)

    function handleConfirmDate() {
        if (!tempDateRange?.from || !tempDateRange?.to) {
            setDateError('Selecione o período completo da viagem.')
            return
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const startDate = new Date(tempDateRange.from)
        startDate.setHours(0, 0, 0, 0)

        if (startDate < today) {
            setDateError('A data de início não pode ser anterior a hoje.')
            return
        }

        setDateError(null)
        setEventStartAndEndDates(tempDateRange)
        closeDatePicker()
    }

    function openDatePicker() {
        setIsDatePickerOpen(true)
    }
    function closeDatePicker() {
        setIsDatePickerOpen(false)
    }

    const displayedDate = eventStartAndEndDates?.from && eventStartAndEndDates?.to
            ? format(eventStartAndEndDates.from, "d 'de' LLL", { locale: ptBR })
                .concat(' até ')
                .concat(format(eventStartAndEndDates.to, "d 'de' LLL", { locale: ptBR }))
            : null

    return (
        <div className="flex items-center gap-3 flex-1 h-16 bg-zinc-900 px-4 rounded-xl shadow-shape">
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <MapPin className="size-5 text-zinc-400 flex-shrink-0" />
                <input
                    disabled={isGuestsInputOpen}
                    type="text"
                    placeholder="Para onde você vai?"
                    onChange={event => setDestination(event.target.value)}
                    className="bg-transparent text-lg placeholder-zinc-400 outline-none w-full min-w-0"
                />
            </div>

            <button
                onClick={openDatePicker}
                disabled={isGuestsInputOpen}
                className="flex items-center gap-2 text-left w-[240px] flex-shrink-0"
            >
                <Calendar className="size-5 text-zinc-400" />
                <span className="text-zinc-400 truncate">
                    {displayedDate || 'Quando?'}
                </span>
            </button>

            {isDatePickerOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-zinc-100">
                                Selecione a data
                            </h2>
                            <button type="button" onClick={closeDatePicker}>
                                <X className="size-5 text-zinc-400" />
                            </button>
                        </div>

                        <DayPicker
                            mode="range"
                            selected={tempDateRange}
                            onSelect={setTempDateRange}
                            locale={ptBR}
                            disabled={{ before: new Date() }}
                        />
                        {dateError && (
                            <p className="text-red-400 text-sm">
                                {dateError}
                            </p>
                        )}

                        <div className="flex justify-end gap-2 pt-3">
                            <Button
                                variant="secondary"
                                onClick={closeDatePicker}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="primary"
                                onClick={handleConfirmDate}
                            >
                                Confirmar
                            </Button>
                        </div>


                    </div>
                </div>
            )}

            <div className="w-px h-5 bg-zinc-800 flex-shrink-0" />

            {isGuestsInputOpen ? (
                <Button
                    variant="secondary"
                    onClick={closeGuestsInput}
                    className="flex-shrink-0 h-11"
                >
                    Alterar local/data
                    <Settings2 className="size-5" />
                </Button>
            ) : (
                <Button
                    variant="primary"
                    onClick={openGuestsInput}
                    className="flex-shrink-0 h-11"
                >
                    Continuar
                    <ArrowRight className="size-5" />
                </Button>
            )}
        </div>
    )
}
