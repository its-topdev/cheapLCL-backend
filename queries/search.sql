select
    p1.id,
    p1.voyage,
    :amount as amount,
    :amountTitle as amountTitle,
    :amountSymbol as amountSymbol,
    :weight as weight,
    :cbm as cbm,
    :sum as chargePrice,
    p1.vesselId,
    v.name as vesselName,
    p1.pol,
    port1.name as polName,
    p1.pod,
    port2.name as podName,
    carrier.name as carrierName,
    p1.departureDate,
    p1.arrivalDate,
    (
        CASE
            WHEN DATEDIFF (p1.departureDate, now()) <= 7 THEN p1.priceDate
            ELSE (
                CASE
                    WHEN (ifnull(p2.summ,0) + :amount) < 20 THEN p1.priceFirst
                    ELSE (
                        CASE
                            WHEN (ifnull(p2.summ,0) + :amount) < 40 THEN p1.priceSecond
                            ELSE 
                                    (
                                CASE
                                    WHEN (ifnull(p2.summ,0) + :amount) < 60 THEN p1.priceThird
                                    ELSE p1.priceFourth
                                END
                            )
                        END
                    )
                END
            )
        END
    ) as price
from
    prices p1
    left join (
        select
            priceId,
            sum(
                CASE
                    WHEN b.cbm > b.weight THEN b.cbm
                    ELSE b.weight
                END
            ) as summ
        FROM
            book_request b
        where
            b.bookStatusId = 1
        group by
            b.priceId
    ) p2 on p1.id = p2.priceId
    left join ports port1 on p1.pol = port1.id
    left join ports port2 on p1.pod = port2.id
    left join carriers carrier on p1.carrierId = carrier.id
    left join vessels v on p1.vesselId = v.id
where
    p1.departureDate >= date(:fromDate)
    and p1.departureDate <= date(:toDate)
    and p1.pol = :pol
    and p1.pod = :pod 
    and p1.deletedAt is null