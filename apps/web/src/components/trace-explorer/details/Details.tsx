import { useSelectedItem } from "../hooks/use-selected-item";
import { EventDetails } from "./EventDetails";
import { SpanDetails } from "./SpanDetails";

export default function Details() {
  const { selectedItem } = useSelectedItem();

  const renderSelectedItem = () => {
    switch (selectedItem.type) {
      case "span":
        return <SpanDetails span={selectedItem}/>;
      case "event":
        return <EventDetails />;
    }
  };

  return (
    <div className="h-full p-4 space-y-4">
      {selectedItem ? (
        renderSelectedItem()
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Select an item to view details
        </div>
      )}
    </div>
  );
}
