<?php
/**
 * Created by PhpStorm.
 * User: diegobarrioh
 * Date: 21/8/15
 * Time: 9:48
 */

namespace AppBundle\Repository;

use AppBundle\Entity\Event;
use AppBundle\Entity\EventType;
use Doctrine\ORM\EntityRepository;

/**
 * This custom Doctrine repository contains some methods which are useful when
 * querying for Event information.
 *
 * @author Diego Barrio <diegobarrioh@gmail.com>
 */
class EventRepository extends EntityRepository
{
    /**
     * Los ultimos eventos
     *
     * @param integer $maxResults
     *
     * @return array
     */
    public function findLatest($maxResults)
    {
        return $this
            ->createQueryBuilder('e')
            ->select('e')
            ->where('e.createdAt <= :now')->setParameter('now', new \DateTime())
            ->orderBy('e.createdAt', 'DESC')
            ->setMaxResults($maxResults)
            ->getQuery()
            ->getResult()
            ;
    }

    /**
     * Por defecto se devuelven ordenados por fecha de creación desc
     * @return array
     */
    public function  findAll()
    {
        return $this
            ->createQueryBuilder('e')
            ->select('e')
            ->orderBy('e.createdAt', 'DESC')
            ->getQuery()
            ->getResult()
            ;
    }

    /**
     * @param EventType $eventType
     *
     * @return array
     */
    public function findLastEventOfType(EventType $eventType)
    {
        return $this
            ->createQueryBuilder('e')
            ->select('e')
            ->where('e.eventType = :eventType')
            ->setParameter('eventType', $eventType)
            ->orderBy('e.createdAt', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getSingleResult()
            ;
    }

    /**
     * @param EventType $eventType
     * @param \DateTime $timeAgo
     *
     * @return array
     */
    public function findGroupedByEventType(EventType $eventType, \DateTime $timeAgo)
    {
        $em = $this->getEntityManager();
        $consulta = $em->createQuery('
            SELECT DATE(e.createdAt) fecha, count(et.id) cuenta, e.subType
            FROM AppBundle:Event e
            JOIN e.eventType et
            WHERE e.eventType = :eventType AND e.createdAt > :timeAgo
            GROUP BY fecha,e.subType
            ORDER BY fecha,e.subType ASC
        ');
        $consulta->setParameters(array(
            'eventType' =>$eventType,
            'timeAgo'=>$timeAgo,
            ));
        $consulta->useResultCache(true, 3600);

        return $consulta->getResult();
    }

    /**
     * Eventos creado a partir de una fecha
     *
     * @param \DateTime $fecha
     *
     * @return array
     */
    public function findCreatedAfter(\DateTime $fecha)
    {
        return $this
            ->createQueryBuilder('e')
            ->select('e')
            ->where('e.createdAt > :fecha')
            ->setParameter('fecha', $fecha)
            ->orderBy('e.createdAt', 'ASC')
            ->getQuery()
            ->getResult()
            ;
    }

    /**
     * Eventos creados a partir de una fecha de un typo especifico
     * @param \DateTime $fecha
     * @param EventType $eventType
     *
     * @return array
     */
    public function findCreatedAfterOfType(\DateTime $fecha, EventType $eventType)
    {
        return $this
            ->createQueryBuilder('e')
            ->select('e')
            ->where('e.createdAt > :fecha')
            ->andWhere('e.eventType = :eventType')
            ->setParameters(array(
                'fecha' => $fecha,
                'eventType' => $eventType,
                                ))
            ->orderBy('e.createdAt', 'ASC')
            ->getQuery()
            ->getResult()
            ;
    }

    /**
     * Eventos de un tipo que también tienen el mismo subtipo
     *
     * @param EventType $eventType
     * @param           $subType
     *
     * @return array
     */
    public function findOfTypeAndSubtype(EventType $eventType, $subType)
    {
        return $this
            ->createQueryBuilder('e')
            ->select('e')
            ->where('e.eventType = :eventType')
            ->andWhere('e.subType = :subType')
            ->setParameters(array(
                                'eventType' => $eventType,
                                'subType' => $subType,
                            ))
            ->orderBy('e.createdAt', 'ASC')
            ->getQuery()
            ->getResult()
            ;
    }

    /**
     * Suma los vales de los eventos de un tipo
     * @param EventType $eventType
     *
     * @return array
     */
    public function sumEventValuesOfEventType(EventType $eventType)
    {
        return $this
            ->createQueryBuilder('e')
            ->select('sum(e.value)')
            ->where('e.eventType = :eventType')
            ->setParameter('eventType', $eventType)
            ->groupBy('e.eventType')
            ->getQuery()
            ->getSingleScalarResult()
            ;
    }

    /**
     * Cuenta los eventos de un tipo
     * @param EventType $eventType
     *
     * @return array
     */
    public function countEventsOfEventType(EventType $eventType)
    {
        return $this
            ->createQueryBuilder('e')
            ->select('count(e)')
            ->where('e.eventType = :eventType')
            ->setParameter('eventType', $eventType)
            ->getQuery()
            ->getSingleScalarResult()
            ;
    }

    /**
     * Cuenta los eventos de un tipo
     *
     * @param EventType $eventType
     * @param \DateTime $time
     *
     * @return array
     */
    public function countEventsOfEventTypeCreatedAfter(EventType $eventType, \DateTime $time)
    {
        return $this
            ->createQueryBuilder('e')
            ->select('count(e)')
            ->where('e.eventType = :eventType')
            ->andWhere('e.createdAt > :time')
            ->setParameter('eventType', $eventType)
            ->setParameter('time', $time)
            ->getQuery()
            ->getSingleScalarResult()
            ;
    }

    /**
     * Los distintos eventos que tengan valor de un cierto tipo
     * @param EventType $eventType
     *
     * @return array
     */
    public function findDistinctAndValueOfEventType(EventType $eventType)
    {

        return $this
            ->createQueryBuilder('e')
            ->select('e')
            ->where('e.eventType = :eventType')
            ->setParameter('eventType', $eventType)
            ->groupBy('e.subType')
            ->getQuery()
            ->getResult()
            ;
    }
}
