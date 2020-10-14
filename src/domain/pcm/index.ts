import { is } from "rambda"
import { defaultValue } from "../../_mocks"
import { defaultWhen, isAppError, setState, wrapWhen } from "../core"
import { stateError } from "../core/behaviors"
import { getProductViewById } from "./services"
import { PcmErrors, PcmProductView, PcmProductView_, productView } from "./types"

export const getProductView = (randomResult: number): productView<PcmProductView> =>
  setState({ productView: PcmProductView_ })(async () => {
    const result = await getProductViewById(randomResult)
      .catch(defaultWhen([isAppError(PcmErrors.Conflict), defaultValue]))
      .catch(wrapWhen([PcmErrors.NotFound], randomResult))

    if (!is(Object, result) || !("response" in result))
      throw stateError(PcmErrors.InvalidResponse, "response")

    const productView = result?.response?.data

    return { productView }
  })
