/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"

import Config from "@/config"

import { GeneralApiProblem } from "./apiProblem"
import type { ApiConfig } from "./types"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Logs in a user and returns a token.
   */
  async login(
    username: string,
    password: string,
  ): Promise<
    { kind: "ok"; token: string; fk_pessoa_fisica?: number } | (GeneralApiProblem & { error?: any })
  > {
    const payload = {
      grant_type: "password",
      client_id: "bqdKF45eaNNEBiy4bFTJkVpqWfaRC1Vp8uU2J8Au",
      client_secret: "6Doz5E9eQaM9tNacDh8p5oWXOwpuoMxVEkDdyQyAaRCgMi79RAzcfwBsmFnpN2Hj",
      username,
      password,
    }
    const response: ApiResponse<any> = await this.apisauce.post("/v1/auth/token/", payload, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    if (!response.ok) {
      return { kind: "rejected", error: response.data }
    }
    try {
      const token = response.data?.access_token
      const fk_pessoa_fisica = response.data?.fk_pessoa_fisica
      if (token) {
        return { kind: "ok", token, fk_pessoa_fisica }
      } else {
        return { kind: "bad-data", error: response.data }
      }
    } catch (e) {
      return { kind: "bad-data", error: response.data }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
