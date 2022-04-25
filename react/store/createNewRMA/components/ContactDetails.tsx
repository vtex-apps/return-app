import React from 'react'
import { Input, Textarea } from 'vtex.styleguide'

export const ContactDetails = ({ handleInputChange, formInputs }) => {
  return (
    <div className="flex-ns flex-wrap flex-row mt5">
      <div className="flex-ns flex-wrap flex-auto flex-column pa4">
        <p>Contact details</p>
        <div className="mb4">
          <Input
            name="name"
            placeholder="Name"
            onChange={handleInputChange}
            value={formInputs.name}
          />
        </div>
        <div className="mb4">
          <Input
            disabled
            name="email"
            placeholder="email"
            onChange={handleInputChange}
            value={formInputs.email}
          />
        </div>
        <div className="mb4">
          <Input
            name="phone"
            placeholder="Phone"
            onChange={handleInputChange}
            value={formInputs.phone}
          />
        </div>
      </div>

      <div className="flex-ns flex-wrap flex-auto flex-column pa4">
        <p>Pickup Address</p>
        <div className="mb4">
          <Input
            name="address"
            placeholder="address"
            onChange={handleInputChange}
            value={formInputs.address}
          />
        </div>
        <div className="mb4">
          <Input
            name="locality"
            placeholder="Locality"
            onChange={handleInputChange}
            value={formInputs.locality}
          />
        </div>
        <div className="mb4">
          <Input
            name="state"
            placeholder="State"
            onChange={handleInputChange}
            value={formInputs.state}
          />
        </div>
        <div className="mb4">
          <Input
            name="zip"
            placeholder="zip"
            onChange={handleInputChange}
            value={formInputs.zip}
          />
        </div>
        <div className="mb4">
          <Input
            name="country"
            placeholder="Country"
            onChange={handleInputChange}
            value={formInputs.country}
          />
        </div>
      </div>
      <div className="mt4 ph4">
        <p>Extra comment</p>
        <div>
          <Textarea
            name="extraComment"
            resize="none"
            onChange={handleInputChange}
            maxLength="250"
            value={formInputs.extraComment}
          />
        </div>
      </div>
    </div>
  )
}
