import { ReactNode } from "react";

interface Props<TItem> {
  items: TItem[];
  ItemRenderElement: (props: { item: TItem }) => ReactNode;
}
export default function SeperatedList<TItem extends IdentifiableObject>({
  items,
  ItemRenderElement,
}: Props<TItem>) {
  return (
    <div>
      {items.flatMap((item, index) => {
        const newElements = [
          <ItemRenderElement key={"item_" + item.id} item={item} />,
        ];

        if (index > 0) {
          newElements.unshift(<hr key={"hr_" + index} />);
        }

        return newElements;
      })}
    </div>
  );
}

interface IdentifiableObject {
  id: string | number;
}
