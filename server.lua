-- Pass the connecting player's display name to the loading screen.
-- FiveM exposes this data as window.nuiHandoverData in the loading-screen page.

AddEventHandler('playerConnecting', function(_, _, deferrals)
    local playerId = source
    local playerName = GetPlayerName(playerId) or 'PLAYER'

    if not deferrals or type(deferrals.handover) ~= 'function' then
        print('[ERA Loading] Handover is unavailable for this connection; using the UI fallback name.')
        return
    end

    local success, err = pcall(function()
        -- Keep the call form aligned with the Cfx.re loading-screen documentation.
        deferrals.handover({
            name = playerName
        })
    end)

    if not success then
        print(('[ERA Loading] Could not hand over player data: %s'):format(tostring(err)))
    end
end)
