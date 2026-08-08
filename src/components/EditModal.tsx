"use client";


import { Envelope } from "@gravity-ui/icons";
import {
  Button,
  Input,
  Label,
  Modal,
  Surface,
  TextArea,
  TextField,
} from "@heroui/react";
import { SquarePen,Pencil } from "lucide-react";
import { redirect } from "next/navigation";

const EditModal = ({ book }) => {
// console.log(book,'book');
const {_id,campaign_title,funding_goal,minimum_contribution,campaign_story,campaign_image_url} = book;


const onSubmit = async (e) => {
e.preventDefault();
const formData = new FormData(e.currentTarget);
const item = Object.fromEntries(formData.entries());


const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${_id}` , {
  method: "PATCH",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify(item)
})
const data = await res.json(); 
// console.log(data,'data');

 // ✅ success check
  if (data.modifiedCount > 0) {
    alert("campaigns updated successfully ✅");
  } else {
    alert("No changes detected ⚠️");
  }
redirect('/dashboard/Creator/Home')
}


  return (
    <Modal>
      <Button className="rounded-md border border-indigo-200  bg-[#d9cde9] text-[#8121ff]">
         <Pencil /> Update 
      </Button>

      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-lg">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Icon>
                <Envelope className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Edit Campaigns</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="p-6">
              <Surface>
                <form onSubmit={onSubmit} className="flex flex-col gap-4">

                  {/* <TextField className="w-full" name="campaign_image_url" isRequired  defaultValue={campaign_image_url}>
                    <Label>Image </Label>
                    <Input className="w-full" name="campaign_image_url"/> 
                  </TextField> */}

                  <TextField className="w-full" name="campaign_title" isRequired  defaultValue={campaign_title}>
                    <Label>Title</Label>
                    <Input className="w-full" name="campaign_title"  /> 
                  </TextField>

                
                  <TextField className="w-full" name="funding_goal" isRequired  defaultValue={funding_goal}>
                    <Label>Goal(Credits)</Label>
                     <Input className="w-full" name="funding_goal"  /> 
                  </TextField>

                  <TextField className="w-full" name="minimum_contribution" isRequired defaultValue={minimum_contribution}>
                    <Label>Raised(Credits)</Label>
                    <Input className="w-full" name="minimum_contribution"  /> 
                  </TextField>

                  {/* <TextField className="w-full" name="deliveryFee" isRequired  defaultValue={deliveryFee}>
                    <Label>Delivery Fee</Label>
                    <Input className="w-full" name="deliveryFee"  /> 
                  </TextField> */}

                  {/* <TextField className="w-full" name="status" isRequired  defaultValue={status}>
                    <Label>Status</Label>
                    <Input className="w-full" name="status"  /> 
                  </TextField> */}

                  <TextField className="w-full" name="campaign_story" isRequired  defaultValue={campaign_story}>
                    <Label>Campaign Story</Label>
                    <TextArea
                      name="campaign_story"
                     className="w-full"
                    />
                  </TextField>

                  <Modal.Footer>
                    
                    <Button type="submit" slot="close">
                      Save
                    </Button>
                  </Modal.Footer>

                </form>
              </Surface>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default EditModal;