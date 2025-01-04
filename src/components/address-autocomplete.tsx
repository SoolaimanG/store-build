import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressAutocompleteProps {
  id: string;
  label: string;
  onAddressSelect: (address: string) => void;
}

export function AddressAutocomplete({
  id,
  label,
}: //   onAddressSelect,
AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  //   useEffect(() => {
  //     if (!window.google) {
  //       console.error("Google Maps JavaScript API not loaded");
  //       return;
  //     }

  //     const autocomplete = new google.maps.places.Autocomplete(
  //       inputRef.current as HTMLInputElement,
  //       {
  //         types: ["address"],
  //       }
  //     );

  //     autocomplete.addListener("place_changed", () => {
  //       const place = autocomplete.getPlace();
  //       if (place.formatted_address) {
  //         onAddressSelect(place.formatted_address);
  //       }
  //     });

  //     return () => {
  //       google.maps.event.clearInstanceListeners(autocomplete);
  //     };
  //   }, [onAddressSelect]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} ref={inputRef} required />
    </div>
  );
}
