"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"

interface Web3ContextType {
  account: string | null
  chainId: number | null
  connecting: boolean
  connected: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  signMessage: (message: string) => Promise<string>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)

  // 检查是否有 MetaMask
  const checkIfMetaMaskAvailable = () => {
    return typeof window !== "undefined" && window.ethereum !== undefined
  }

  // 初始化 provider
  useEffect(() => {
    if (checkIfMetaMaskAvailable()) {
      const ethereum = window.ethereum
      const ethersProvider = new ethers.BrowserProvider(ethereum)
      setProvider(ethersProvider)

      // 检查是否已经连接
      const checkConnection = async () => {
        try {
          const accounts = await ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setAccount(accounts[0])
            setConnected(true)

            const network = await ethersProvider.getNetwork()
            setChainId(Number(network.chainId))
          }
        } catch (error) {
          console.error("Failed to get accounts", error)
        }
      }

      checkConnection()

      // 监听账户变化
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null)
          setConnected(false)
        } else {
          setAccount(accounts[0])
          setConnected(true)
        }
      }

      // 监听链ID变化
      const handleChainChanged = (chainId: string) => {
        setChainId(Number(chainId))
        window.location.reload()
      }

      ethereum.on("accountsChanged", handleAccountsChanged)
      ethereum.on("chainChanged", handleChainChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged)
          ethereum.removeListener("chainChanged", handleChainChanged)
        }
      }
    }
  }, [])

  // 连接钱包
  const connectWallet = async () => {
    if (!checkIfMetaMaskAvailable()) {
      window.open("https://metamask.io/download.html", "_blank")
      return
    }

    try {
      setConnecting(true)
      const ethereum = window.ethereum
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        setConnected(true)

        if (provider) {
          const network = await provider.getNetwork()
          setChainId(Number(network.chainId))
        }
      }
    } catch (error) {
      console.error("Failed to connect wallet", error)
    } finally {
      setConnecting(false)
    }
  }

  // 断开钱包连接
  const disconnectWallet = () => {
    setAccount(null)
    setChainId(null)
    setConnected(false)
  }

  // 签名消息
  const signMessage = async (message: string): Promise<string> => {
    if (!provider || !account) {
      throw new Error("Wallet not connected")
    }

    try {
      const signer = await provider.getSigner()
      return await signer.signMessage(message)
    } catch (error) {
      console.error("Failed to sign message", error)
      throw error
    }
  }

  return (
    <Web3Context.Provider
      value={{
        account,
        chainId,
        connecting,
        connected,
        connectWallet,
        disconnectWallet,
        signMessage,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}
