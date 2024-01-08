/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useRef, useState } from 'react'
import { StepOne, StepFour, StepTwo, steps } from '../Steps'
import { useCreateEmployeeForm } from '../../../../../contexts/create-employee-form'
import { validateCurrentStep } from '../../../../../validations/schemas'
import { useMutation } from '@tanstack/react-query'
import { postEmployee } from '../../../../../api/employee'
import { StandardButton } from '../../../../../components/Buttons/Standard'

import clsx from 'clsx'
import { CustomDialog } from '../../../../../components/Dialog/SimpleDialog'
import { type ApplicationError } from '../../../../../exceptions/errors'
import { useDialog } from '../../../../../hooks/dialog'
import { StepThree } from '../Steps/Step3'

export const Stepper = (): React.JSX.Element => {
  const { formData } = useCreateEmployeeForm()
  const [activeStep, setActiveStep] = React.useState(0)

  const ref = useRef<HTMLDialogElement>(null)
  const onOpenModal = (): void => {
    ref.current?.showModal()
  }
  const { dialog, show } = useDialog(ref)

  const [errors, setErrors] = useState<Record<string, string[]> | null>(null)

  const {
    isLoading,
    mutate,
    isError,
    isSuccess,
    data: createdEmployeeId,
  } = useMutation({
    mutationFn: postEmployee,
    onError: (error: ApplicationError) => {
      show({
        msg: error.getErrorMessage(),
        title: 'Failed to create employee',
        type: 'error',
      })
    },
    onSuccess: () => {
      show({
        msg: 'Employee created successfully',
        title: 'Employee created',
        type: 'success',
      })
    },
  })

  const getCurrentStep = (currStep: number): JSX.Element | undefined => {
    switch (currStep) {
      case 0:
        return <StepOne errors={errors} />

      case 1:
        return <StepTwo errors={errors} />

      case 2:
        return <StepThree errors={errors} />

      case 3:
        return (
          <StepFour
            errors={errors}
            setErrors={setErrors}
            isLoading={isLoading}
          />
        )
    }
  }

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }
  const handleNext = async (): Promise<void> => {
    const { veredict, errors } = await validateCurrentStep(formData, activeStep)

    if (!veredict) {
      setErrors(errors)
      return
    }
    setErrors(null)
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleFinish = async (): Promise<void> => {
    mutate(formData)
  }
  console.log(formData)
  return (
    <div className="flex flex-col w-full gap-6 p-3">
      <CustomDialog
        ref={ref}
        dialogData={dialog}
        redirectUrl={`/app/employee/detail/${createdEmployeeId}`}
      />
      <ul className="steps">
        {steps.map((step) => (
          <li
            className={clsx(
              {
                'step-success':
                  step.stepId < activeStep || formData.stepFour.avatar,
              },
              { 'step-accent': step.stepId === activeStep },
              'step step-primary',
            )}
            key={step.label}
          >
            {step.label}
          </li>
        ))}
      </ul>
      <div className="flex p-3">{getCurrentStep(activeStep)}</div>
      <div className="justify-center gap-24 flex p-3">
        {activeStep !== 0 && (
          <StandardButton
            disabled={isLoading}
            onClick={handleBack}
            size="w-[10%]"
          >
            Previous Step
          </StandardButton>
        )}
        {activeStep === steps.length - 1 ? (
          <StandardButton onClick={handleFinish}>
            {isLoading ? (
              <span className="loading loading-dots"></span>
            ) : (
              'Create'
            )}
          </StandardButton>
        ) : (
          <StandardButton onClick={handleNext} size="w-[10%]">
            Next Step
          </StandardButton>
        )}
      </div>
    </div>
  )
}
