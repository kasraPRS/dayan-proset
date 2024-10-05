import { Injectable } from "@angular/core";
import {
  Asset,
  DepreciationCalculation,
  DepreciationMethod,
} from "@proset/maintenance-client";
import * as moment from "jalali-moment";
import * as _ from "lodash";

@Injectable({
  providedIn: "root",
})
export class AssetCalculateDepreciationService {
  constructor() {}

  init(asset: Asset, forceUpdate = false): DepreciationCalculation[] {
    if (!_.isEmpty(asset)) {
      if (!asset.depreciationCalculationList?.length || forceUpdate) {
        return this.calculateDepreciation(asset);
      }
      return asset.depreciationCalculationList;
    }
    return [];
  }

  calculateDepreciation(asset: Asset): DepreciationCalculation[] {
    let depreciationCalculationList: any[] = [];

    const { financial, utilizationDate } = asset;
    if (financial) {
      const {
        depreciationMethod,
        price,
        consumableLife,
        depreciationRate,
        depreciationValue,
      } = financial;

      const isValidRateOrLife =
        (depreciationMethod === DepreciationMethod.DESCENDING &&
          depreciationRate) ||
        (depreciationMethod === DepreciationMethod.DIRECT && consumableLife);

      if (
        utilizationDate &&
        depreciationMethod &&
        isValidRateOrLife &&
        price &&
        depreciationValue
      ) {
        switch (depreciationMethod) {
          case DepreciationMethod.DIRECT: {
            const utilizationDateMoment = moment(utilizationDate, "YYYY-MM-DD");
            const toRange = Number(consumableLife) + 1;
            _.range(0, toRange).forEach((index) => {
              let accumulatedDepreciation = 0;
              let depreciationExpense = 0;
              let bookValue = Number(price);
              if (index >= 1) {
                accumulatedDepreciation =
                  depreciationCalculationList[index - 1]
                    .accumulatedDepreciation;
                depreciationExpense =
                  (price - depreciationValue) / Number(consumableLife);
                accumulatedDepreciation += depreciationExpense;
                bookValue = price - accumulatedDepreciation;
              }
              let depreciationYear = utilizationDateMoment
                .clone()
                .add(index, "years")
                .format("jYYYY"); // Utilizing jalali-moment for Jalali date
              let depreciationCalculation: DepreciationCalculation = {
                accumulatedDepreciation: Math.round(accumulatedDepreciation),
                depreciationYear: depreciationYear, // Now holds a Jalali date string
                bookValue: Math.round(Number(bookValue)),
              };
              depreciationCalculationList.push(depreciationCalculation);
            });
            break;
          }
          case DepreciationMethod.DESCENDING:
          default:
            return [];
        }
      }
    }
    return _.uniqBy(
      depreciationCalculationList,
      (dp: DepreciationCalculation) => dp.depreciationYear,
    );
  }

  getDepricationDate(consumableLife: number, utilizationDate: string) {
    if (consumableLife && utilizationDate) {
      const utilizationDateMoment = moment(utilizationDate, "YYYY-MM-DD");

      return utilizationDateMoment
        .clone()
        .add(consumableLife, "years")
        .toDate();
    }

    return null;
  }
}
