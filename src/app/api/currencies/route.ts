import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';

const GET_CURRENCIES_QUERY = /* GraphQL */ `
  query getCurrencies {
    localization {
      availableCountries {
        currency {
          isoCode
          name
          symbol
        }
        isoCode
        name
        unitSystem
      }
      country {
        currency {
          isoCode
          name
          symbol
        }
        isoCode
        name
        unitSystem
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    const res = await shopifyFetch({
      query: GET_CURRENCIES_QUERY,
      cache: 'no-store',
    });

    const body = res.body as any;
    
    if (!body?.data?.localization) {
      console.warn('No localization data received from Shopify API');
      return NextResponse.json({ 
        countries: [], 
        currencies: [],
        error: 'No localization data available'
      });
    }

    const { availableCountries, country } = body.data.localization;
    
    // Extract unique currencies from countries
    const currenciesMap = new Map();
    availableCountries.forEach((country: any) => {
      if (country.currency) {
        currenciesMap.set(country.currency.isoCode, country.currency);
      }
    });

    const currencies = Array.from(currenciesMap.values());

    return NextResponse.json({
      countries: availableCountries || [],
      currencies: currencies,
      currentCountry: country,
    });

  } catch (error) {
    console.error('Error fetching currencies from Shopify:', error);
    return NextResponse.json(
      { 
        countries: [], 
        currencies: [],
        error: 'Failed to fetch currency data'
      },
      { status: 500 }
    );
  }
}
