import api from "../api"
import { HomeResult } from "../types"

export enum Category {
  censored,
  uncensored,
  Uncensored_Leaked,
  Chinese,
  new,
  other,
  random,
}

class MovieService {
  private getRandomParam = () => `&_=${new Date().getTime()}`

  public getAll = async (page = 1) => {
    const response = await api.get<HomeResult>(
      `provide/vod?ac=detail&pg=${page}${this.getRandomParam()}`
    )
    return response.data
  }

  public getMovieDetail = async (id: string | number) => {
    const response = await api.get(
      `provide/vod?ac=detail&ids=${id}${this.getRandomParam()}`
    )
    return response.data
  }

  public search = async (keyword: string) => {
    const response = await api.get(
      `provide/vod?ac=detail&wd=${keyword}${this.getRandomParam()}`
    )
    return response.data
  }

  public getByCategory = async (
    category: Category,
    page = 1,
    keyword?: string
  ) => {
    switch (category) {
      case Category.censored: {
        const response = await api.get<HomeResult>(
          `provide/vod?ac=detail&t=1&pg=${page}${this.getRandomParam()}`
        )
        return response.data
      }
      case Category.uncensored: {
        const response = await api.get<HomeResult>(
          `provide/vod?ac=detail&t=2&pg=${page}${this.getRandomParam()}`
        )
        return response.data
      }
      case Category.Uncensored_Leaked: {
        const response = await api.get<HomeResult>(
          `provide/vod?ac=detail&t=3&pg=${page}${this.getRandomParam()}`
        )
        return response.data
      }
      case Category.Chinese: {
        const response = await api.get<HomeResult>(
          `provide/vod?ac=detail&t=5&pg=${page}${this.getRandomParam()}`
        )
        return response.data
      }
      case Category.new: {
        const response = await api.get<HomeResult>(
          `provide/vod?ac=detail&h=24&pg=${page}${this.getRandomParam()}`
        )
        return response.data
      }
      case Category.other: {
        const response = await api.get(
          `provide/vod?ac=detail&wd=${keyword}${this.getRandomParam()}`
        )
        return response.data
      }
      case Category.random: {
        return this.getRandomVideo()
      }
    }
  }
  public getRandomVideo = async () => {
    const page = Math.floor(Math.random() * 299) + 1
    const response = await api.get<HomeResult>(
      `provide/vod?ac=detail&pg=${page}${this.getRandomParam()}`
    )
    return response.data
  }
}

const m = new MovieService()
export default m
