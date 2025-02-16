import { FC } from "react";
import { Text } from "./text";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { templateShowCase } from "@/types";

const TemplateCard: FC<templateShowCase> = (template) => {
  return (
    <div className="md:w-[35rem] w-[30rem] h-fit block p-7 bg-slate-800 rounded-xl">
      <Avatar className="rounded-md w-full h-[20rem] md:h-[23rem]">
        <AvatarImage
          src={template.image}
          alt={template.name}
          className="object-cover"
        />
        <AvatarFallback className="rounded-md">
          {template.name[0]}
        </AvatarFallback>
      </Avatar>
      <div className="mt-2">
        <h3 className="text-xl font-semibold">{template.name}</h3>
        <Text className="line-clamp-1 text-gray-400">
          {template.descriptions}
        </Text>
      </div>
    </div>
  );
};

export default TemplateCard;
